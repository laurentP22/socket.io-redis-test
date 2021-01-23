# Error report:
When using io.of('/admin').adapter.allRooms I noticed 3 different responses:

- One containing an array of all the rooms of the nodes (Good !).
- One with a timeout error but containing an array of all the rooms of the nodes (related to issue #210).
- The last one, without any error but containing an empty array  (Bad !).

I am a beginner in redis ( and more generally in programming), so I'm not sure that those errors don't come from my code.

I think that this issue can be related to the issue #210 : timeout reached while waiting for clients response.
Neverless, the fact of having an empty array is never mentioned.

The errors are random, sometimes everything works well, and sometimes the reponses are false (empty array)

In the following section I'm going to present the logs coming from redis and the terminal for each response.

## Configuration :
Ip of the containers :

* 172.29.0.2 /nginx
* 172.24.0.5 /redis-1
* 172.24.0.4 /redis-2
* 172.24.0.3 /redis-3
* 172.24.0.8 /node-1
* 172.24.0.6 /node-2
* 172.24.0.7 /node-3


## Redis standalone
I first tried my code by using redis in standalone :

```javascript
const io = require('socket.io')(4000);
const redisAdapter = require('socket.io-redis');
io.adapter(redisAdapter({ host: process.env.REDIS_HOST , port: process.env.REDIS_PORT }));
```
```sh
    docker-compose up --build
```

To watch the log of the redis-standalone run :

```sh
    docker exec -it redis-standalone redis-cli monitor
```
### Monitor redis-standalone

```
1568400491.517686 [0 172.24.0.8:58276] "info"
1568400491.520672 [0 172.24.0.8:58278] "info"
1568400491.522987 [0 172.24.0.8:58278] "psubscribe" "socket.io#/#*"
1568400491.523561 [0 172.24.0.8:58278] "subscribe" "socket.io-request#/#" "socket.io-response#/#"
1568400491.526410 [0 172.24.0.8:58278] "psubscribe" "socket.io#/admin#*"
1568400491.526566 [0 172.24.0.8:58278] "subscribe" "socket.io-request#/admin#" "socket.io-response#/admin#"
1568400491.592963 [0 172.24.0.7:33018] "info"
1568400491.593362 [0 172.24.0.7:33020] "info"
1568400491.597299 [0 172.24.0.7:33020] "psubscribe" "socket.io#/#*"
1568400491.597394 [0 172.24.0.7:33020] "subscribe" "socket.io-request#/#" "socket.io-response#/#"
1568400491.597886 [0 172.24.0.7:33020] "psubscribe" "socket.io#/admin#*"
1568400491.597897 [0 172.24.0.7:33020] "subscribe" "socket.io-request#/admin#" "socket.io-response#/admin#"
1568400491.600134 [0 172.24.0.6:54672] "info"
1568400491.600469 [0 172.24.0.6:54674] "info"
1568400491.603441 [0 172.24.0.6:54674] "psubscribe" "socket.io#/#*"
1568400491.603947 [0 172.24.0.6:54674] "subscribe" "socket.io-request#/#" "socket.io-response#/#"
1568400491.603981 [0 172.24.0.6:54674] "psubscribe" "socket.io#/admin#*"
1568400491.603990 [0 172.24.0.6:54674] "subscribe" "socket.io-request#/admin#" "socket.io-response#/admin#"
```

Everything goes well, the 3 nodes subscribe to the admin and default channel.

##  Start to emit
Send an emit via the frontend to print an array containing the rooms in the terminal.

### Monitor redis-standalone

```
1568400988.232520 [0 172.24.0.6:54746] "pubsub" "numsub" "socket.io-request#/admin#"
1568400988.232995 [0 172.24.0.6:54746] "publish" "socket.io-request#/admin#" "{\"requestid\":\"cb4ni5\",\"type\":2}"
1568400988.234219 [0 172.24.0.8:58362] "publish" "socket.io-response#/admin#" "{\"requestid\":\"cb4ni5\",\"rooms\":[]}"
1568400988.234480 [0 172.24.0.7:33092] "publish" "socket.io-response#/admin#" "{\"requestid\":\"cb4ni5\",\"rooms\":[]}"
1568400988.235267 [0 172.24.0.6:54746] "publish" "socket.io-response#/admin#" "{\"requestid\":\"cb4ni5\",\"rooms\":[\"/admin#-Gr08VrOuBSoaxNXAAAA\",\"room1\"]}"
```
### Terminal :
```
node-2     | Admin connected to socket : /admin#-Gr08VrOuBSoaxNXAAAA
node-2     | Joined room : room1
node-2     | [ '/admin#-Gr08VrOuBSoaxNXAAAA', 'room1' ]
```
### Result :

* Each of the 3 nodes publish an array with the rooms that they have.
* The console displays all the rooms created.

### Redis cluster
After testing socket.io with redis in standalone, I tried to use it with a cluster of redis.
```javascript
const io = require('socket.io')(4000)
const redisAdapter = require('socket.io-redis');
const IoRedis = require('ioredis');

const startupNodes = [
  {
    port: 6379,
    host: 'redis-1'
  },
  {
    port: 6379,
    host: 'redis-2'
  },
  {
    port: 6379,
    host: 'redis-3'
  }
];

io.adapter(redisAdapter({
  pubClient: new IoRedis.Cluster(startupNodes),
  subClient: new IoRedis.Cluster(startupNodes),
  requestsTimeout: 5000
}));
```
```sh
    docker-compose up --build
```

To watch the log of the redis-1 / redis-2 / redis-3 open 3 terminals and run:

```sh
    docker exec -it redis-X redis-cli monitor
```
### Monitor redis-1
```
1568401086.904816 [0 172.24.0.6:39490] "info"
1568401086.906776 [0 172.24.0.6:39490] "psubscribe" "socket.io#/#*"
1568401086.907680 [0 172.24.0.6:39490] "subscribe" "socket.io-request#/#" "socket.io-response#/#"
1568401086.908448 [0 172.24.0.6:39490] "psubscribe" "socket.io#/admin#*"
1568401086.908463 [0 172.24.0.6:39490] "subscribe" "socket.io-request#/admin#" "socket.io-response#/admin#"
1568401086.981564 [0 172.24.0.7:54964] "info"
1568401086.986024 [0 172.24.0.7:54968] "info"
1568401086.986748 [0 172.24.0.7:54968] "psubscribe" "socket.io#/#*"
1568401086.986819 [0 172.24.0.7:54968] "subscribe" "socket.io-request#/#" "socket.io-response#/#"
1568401086.986875 [0 172.24.0.7:54968] "psubscribe" "socket.io#/admin#*"
1568401086.987091 [0 172.24.0.7:54968] "subscribe" "socket.io-request#/admin#" "socket.io-response#/admin#"
```
### Monitor redis-2
```
1568401086.942166 [0 172.24.0.8:54774] "info"
1568401086.946072 [0 172.24.0.8:54778] "info"
1568401086.947613 [0 172.24.0.8:54778] "psubscribe" "socket.io#/#*"
1568401086.947710 [0 172.24.0.8:54778] "subscribe" "socket.io-request#/#" "socket.io-response#/#"
1568401086.947880 [0 172.24.0.8:54778] "psubscribe" "socket.io#/admin#*"
1568401086.947960 [0 172.24.0.8:54778] "subscribe" "socket.io-request#/admin#" "socket.io-response#/admin#"
```

### Monitor redis-3
```
1568401086.896804 [0 172.24.0.6:34528] "info"
1568401086.897422 [0 172.24.0.6:34530] "info"
1568401086.942664 [0 172.24.0.8:49274] "info"
1568401086.981717 [0 172.24.0.7:44396] "info"
```

2 nodes (node-2 / node-3) subscribed on redis-1
1 node (node-1) subscribed on redis-2

## 1st response : Good one !
Send an emit via the frontend to print in the terminal an array containing the rooms.

## Monitor redis-1
```
1568404454.750877 [0 172.24.0.6:40526] "publish" "socket.io-response#/admin#" "{\"requestid\":\"lAKE2A\",\"rooms\":[\"/admin#M9bxmxEvJc7Z-Aw8AAAC\",\"room1\"]}"
1568404454.751508 [0 172.24.0.7:54964] "publish" "socket.io-response#/admin#" "{\"requestid\":\"lAKE2A\",\"rooms\":[]}"
```
## Monitor redis-2
```
1568404454.749839 [0 172.24.0.6:43370] "pubsub" "numsub" "socket.io-request#/admin#"
1568404454.752182 [0 172.24.0.8:34694] "info"
1568404454.753058 [0 172.24.0.8:34694] "publish" "socket.io-response#/admin#" "{\"requestid\":\"lAKE2A\",\"rooms\":[]}"
```
## Monitor redis-3
```
1568404454.750073 [0 172.24.0.6:34528] "publish" "socket.io-request#/admin#" "{\"requestid\":\"lAKE2A\",\"type\":2}"
```
### Terminal :
```
node-2     | Admin connected to socket : /admin#M9bxmxEvJc7Z-Aw8AAAC
node-2     | Joined room : room1
node-2     | [ '/admin#M9bxmxEvJc7Z-Aw8AAAC', 'room1' ]    
```
### Result :

* Each of the 3 nodes publish an array with the rooms that they have ( this time the redis-1 publish the rooms of the node-2 and node-3).
* No error
* The console displays all the rooms created.

##  2nd response : related to the issue #210
Reload the page and send an emit again.

### Monitor redis-1
```
1568401287.692271 [0 172.24.0.8:58780] "info"
1568401287.692751 [0 172.24.0.8:58780] "publish" "socket.io-response#/admin#" "{\"requestid\":\"BN2vDz\",\"rooms\":[]}"
```
### Monitor redis-2
```
1568401287.690422 [0 172.24.0.6:43370] "info"
1568401287.691055 [0 172.24.0.6:43370] "publish" "socket.io-request#/admin#" "{\"requestid\":\"BN2vDz\",\"type\":2}"
1568401287.694240 [0 172.24.0.6:43370] "publish" "socket.io-response#/admin#" "{\"requestid\":\"BN2vDz\",\"rooms\":[\"/admin#8es_QdAFumP59B8UAAAA\",\"room1\"]}"
```
### Monitor redis-3
```
1568401287.689449 [0 172.24.0.6:34528] "pubsub" "numsub" "socket.io-request#/admin#"
1568401287.693826 [0 172.24.0.7:44894] "info"
1568401287.694637 [0 172.24.0.7:44894] "publish" "socket.io-response#/admin#" "{\"requestid\":\"BN2vDz\",\"rooms\":[]}"
```
### Console :
```
node-2     | Admin connected to socket : /admin#8es_QdAFumP59B8UAAAA
node-2     | Joined room : room1
node-2     | Error: timeout reached while waiting for allRooms response
node-2     |     at Timeout._onTimeout (/app/node_modules/socket.io-redis/index.js:545:48)
node-2     |     at listOnTimeout (internal/timers.js:531:17)
node-2     |     at processTimers (internal/timers.js:475:7)
node-2     | [ '/admin#8es_QdAFumP59B8UAAAA', 'room1' ]
```
### Result :
* Each of the 3 nodes publish an array with the rooms that they have.
  Nevertheless, I thought that the redis-1 would have published the rooms of the node-2 and the node-3, same for redis-2 with the node-1.
  It seems that the redis in charge to publish is decided randomly.
* A timeout error is reached
* The console displays all the rooms created.

## 3rd response : empty array
Reload the page and send an emit again.

### Monitor redis-1
```
1568401488.091953 [0 172.24.0.6:40526] "info"
1568401488.092693 [0 172.24.0.6:40526] "pubsub" "numsub" "socket.io-request#/admin#"
1568401488.093330 [0 172.24.0.6:40526] "publish" "socket.io-request#/admin#" "{\"requestid\":\"UXgG5Z\",\"type\":2}"
1568401488.094120 [0 172.24.0.7:54964] "publish" "socket.io-response#/admin#" "{\"requestid\":\"UXgG5Z\",\"rooms\":[]}"
```
### Monitor redis-2
nothing...

### Monitor redis-3
```
1568401488.094709 [0 172.24.0.8:49274] "publish" "socket.io-response#/admin#" "{\"requestid\":\"UXgG5Z\",\"rooms\":[]}"
1568401488.095743 [0 172.24.0.6:34528] "publish" "socket.io-response#/admin#" "{\"requestid\":\"UXgG5Z\",\"rooms\":[\"/admin#45P6eYV7fBJSLAU_AAAB\",\"room1\"]}"
```
### Terminal :
```
node-2     | Admin disconnected
node-2     | Admin connected to socket : /admin#45P6eYV7fBJSLAU_AAAB
node-2     | Joined room : room1
node-2     | []
```
### Result :

* Each of the 3 nodes publish an array with the rooms that they have.
* No error
* The console displays an empty array
