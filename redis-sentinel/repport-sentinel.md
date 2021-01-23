I was making some test of failover with a redis-sentinel configuration when I noticed a timeout error (for the allRooms function for example) in a particular case.

I think this issue isn't a major problem but it maybe usefull to reference it.

## Configuration:
Docker environment:
( I know that redis-sentinel may have some issue with docker but in my tests it doesn't seems to be a problem)

- 3 clients (nodejs server)
- 1 redis master
- 1 redis slave
- 3 sentinels (redis-1, redis-2, redis-3)

sentinel.conf :

```
port 6379
sentinel monitor mymaster redis-a 6379 2
sentinel down-after-milliseconds mymaster 5000
sentinel failover-timeout mymaster 60000
sentinel parallel-syncs mymaster 1
```

socket.io implementation with redis-sentinel:

```javascript
const io = require('socket.io')(4000);
const redisAdapter = require('socket.io-redis');
const Redis = require('ioredis');

const options = {
  sentinels: [
    { 
      host: 'redis-1', 
      port: 6379 
    },
    { 
      host: 'redis-2', 
      port: 6379 
    },
    { 
      host: 'redis-3', 
      port: 6379 
    }
  ],
  name: 'mymaster',
  connectTimeout: 10000
};

let adapter = redisAdapter({
  pubClient: new Redis(options),
  subClient: new Redis(options)
})

adapter.prototype.on('error',function(err) {
  console.log(err);
});

io.adapter(adapter);
```

## Simulation:
stop redis-a (master)
```
  docker-compose stop redis-a
```
Wait 7sec and restart redis-a.
```
  docker-compose start redis-a
```

## Analyse:

If the master (redis-a) is dead for at least 5sec (down-after-milliseconds) then the slave (redis-b) will be promoted as the new master.

If redis-a restart after the connecTimeout, everything works well.

The problem is if it comes back to live before 10sec (connectTimeout). It seems that the clients will not subsribe to the new master and so, with the current calculation of the numsub, a timeout error will be systematically returned (numsub = 0).

This problem may happen in other case ( not sure...)

I think this problem can be serious if working with kubernetes for example, a pod can fail and restart quickly...

NOTE: As a beginner in redis and socket.io, may be someone can confirm or refut my says...



