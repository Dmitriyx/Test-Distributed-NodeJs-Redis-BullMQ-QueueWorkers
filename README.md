To start test run commands:
    - `docker-compose up`
    - `node worker1/app.js`
    - `node worker2/app.js`

I am using Redis as a way to share state/memory between two different processes and show the difference in processing jobs and who is processing it.
