import amqp, { Channel, Connection } from 'amqplib/callback_api';

const { AMQP_HOST, AMQP_INCOMING_QUEUE } = process.env;

class RabbitMqService{
    connection: Connection | null;
    constructor(){
        this.connection = null;
    }
    
    private createConnection(): Promise<Connection | null | any>{
        return new Promise((resolve, reject): void => {
            amqp.connect(AMQP_HOST as string, (err: any, conn:Connection): void => {
                if(err) return reject(err);
                this.connection = conn;
                resolve(conn);
            });
        })
    }

    private async getOrCreateConnection(): Promise<Connection | null>{
        if(this.connection) return this.connection;
        const connection = this.createConnection();
        if(!connection) throw new Error('Connection is null');
        return connection;
    }

    private async createChannel(queueName: string): Promise<Channel>{
        return new Promise((resolve, reject) => {
            this.connection?.createChannel((err: any, ch: Channel) => {
                if(err) reject('Error creating channel');

                ch.assertQueue(queueName, { durable: true });
                resolve(ch);
            });
        });
    }

    public async sendToQueue(queueName: string, message: string, logger: boolean): Promise<void>{
        if(!queueName || !message) throw new Error('Queue name or message is null');
        const channel = await this.createChannel(queueName);
        channel.assertQueue(queueName, { durable: true });
        channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });
        channel.close(()=>{
            if(logger) console.log(`[RabbitMqService] -- ${queueName} -- Channel closed`);
        });
    }

    private async manageFails(callBackResponse: any, receivedMessage: string): Promise<void> {
        const errorQueueName = `${AMQP_INCOMING_QUEUE as string}-error`;
        await this.sendToQueue(errorQueueName, JSON.stringify(callBackResponse), true);

        const backupQueueName = `${AMQP_INCOMING_QUEUE}-backup`;
        await this.sendToQueue(backupQueueName, receivedMessage, false);
    }

    public async startConsuming(_callback: (msg: string) => Promise<any>){
        await this.getOrCreateConnection();
        const channel:Channel = await this.createChannel(AMQP_INCOMING_QUEUE as string);
        channel.prefetch(1);
        channel.consume(AMQP_INCOMING_QUEUE as string, async (msg: any) => {
            if(msg.content){
                if(typeof _callback === "function") {
                    const timeOfReceived = new Date();
                    const callBackResponse = await _callback(msg.content.toString())

                    if(callBackResponse?.status !== 'success'){
                        await this.manageFails(callBackResponse, msg.content.toString());
                    }

                    channel.ack(msg);
                    
                    const timeAfterProcess = new Date();
                    const timeDiff = timeAfterProcess.getTime() - timeOfReceived.getTime();
                    console.log(`[RabbitMqService] -- Message processed in ${timeDiff} ms`);
                };
            }

        }, { noAck: false });
    }
}

export const QueueService = new RabbitMqService();