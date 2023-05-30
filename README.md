To start test run commands:
    - `docker-compose up`
    - `node worker1/app.js`
    - `node worker2/app.js`

I think its cool to notice the `job.data`.
Worker1 sets data to be job1 and Worker2 can not overwrite that to job2.

I am using Redis as a way to share state/memory between two different processes and show the difference in processing jobs and who is processing it.