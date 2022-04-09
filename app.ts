import dotenv from 'dotenv';
dotenv.config({path: './env/.env'});

import log4jsConfig from './src/configs/log4js.json' 
import log4js from 'log4js';
log4js.configure(log4jsConfig);

const logger = log4js.getLogger();

import { QueueService } from "./src/services/rabbitmq-service";
import { AppController } from './src/controller/app-controller';



const processMsg = async (msg: string) => {
  try {
    logger.info(`${new Date()}-- Received message -- Length: ${msg.length}`);
  
    const jsonMsg = JSON.parse(msg);
    const controllerResponse = await AppController.onGet(jsonMsg);
    
    logger.info(`${new Date()}-- Message Processed --`);
    return controllerResponse;
  } catch (error) {
    logger.error(error)
  }

  return {
    status: 'fail',
    message: 'Error processing message'
  }
}


QueueService.startConsuming(processMsg);