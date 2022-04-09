FROM node:16.13

WORKDIR /opt/consumer-jobs-vacancies

COPY package*.json ./

RUN npm ci --production

COPY . .

ENV AMQP_HOST=amqp://guest:guest@172.17.0.2:5672/crawlers

ENV AMQP_QUEUE_NAME=outgoing-queue

ENV JOB_FILTERS="[\"nodejs\", \"node\", \"node.js\"]"

CMD [ "npm", "start" ]
