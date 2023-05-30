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
        redisConnection.get('sequence').then(sequence => {
            const diff = Date.now() - currentTime;
            sequence = sequence || 0;
            console.log('worker2 ----> ', job.data, diff, 'sequence: ', sequence);
            redisConnection.set('currentTime', Date.now());
            redisConnection.set('sequence', +sequence + 1);
        })
    })
}, {
    connection: redisConnection,
    concurrency: 1,
})


redisQueue.add('testjob', {
    data: 'job2'
}, {
    repeat: {
        every: 1000
    },
    removeOnComplete: true,
    removeOnFail: true,
    jobId: 'job'
});

['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => {
        redisConnection.disconnect();
        redisQueue.close();
        redisWorker.close();
        process.exit(0);
    });
})