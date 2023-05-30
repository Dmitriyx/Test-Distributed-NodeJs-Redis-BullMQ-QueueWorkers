const ioredis = require('ioredis');
const bullmq = require('bullmq');
const env = require('../env.js');

const redisConnection = new ioredis(env.redis);
const queuename = 'testqueuename';
const redisQueue = new bullmq.Queue(queuename, {
    connection: redisConnection
})
const redisWorker = new bullmq.Worker(queuename, async job => {
    redisConnection.get('currentTime').then(currentTime => {
        const diff = Date.now() - currentTime;

        console.log('worker1 ----> ', job.data, diff);
        redisConnection.set('currentTime', Date.now());

    })
}, {
    connection: redisConnection,
    concurrency: 1,
})

redisQueue.add('testjob', {
    data: 'job1'
}, {
    repeat: {
        every: 1000
    },
    removeOnComplete: true,
    removeOnFail: true,
});