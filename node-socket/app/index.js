// --------------------------------
// -------- Express Setup ---------
// --------------------------------

console.log("Starting node-socket.io");

// -------------------------------
// --- Redis + Socket.io setup ---
// -------------------------------

// --- REDIS-STANDALONE ---
/*
const io = require('socket.io')(4000);
const redisAdapter = require('./socket.io-redis/index');

let adapter = redisAdapter({ host: 'redis-1', port: '6379' });

adapter.prototype.on('error',(err) => {});

io.adapter(adapter);
*/
// --- IO-REDIS-CLUSTER --

const io = require('socket.io')(4000)
const redisAdapter = require('./socket.io-redis/index');
const Redis = require('ioredis');

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
  },
  {
    port: 6379,
    host: 'redis-4'
  },
  {
    port: 6379,
    host: 'redis-5'
  },
  {
    port: 6379,
    host: 'redis-6'
  }  
];

let adapter = redisAdapter({
  pubClient: new Redis.Cluster(startupNodes),
  subClient: new Redis.Cluster(startupNodes),
  requestsTimeout: 5000
});

adapter.prototype.on('error',(err) => {});

io.adapter(adapter);

// --- REDIS-SENTINEL ---
/*
const io = require('socket.io')(4000);
const redisAdapter = require('./socket.io-redis/index');
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
  //connectTimeout: 5000,
  //pingTimeout: 10000,
  //pingInterval: 12000
};

let adapter = redisAdapter({
  pubClient: new Redis(options),
  subClient: new Redis(options),
  //requestsTimeout : 15000 // Timeout for a redis request
})

adapter.prototype.on('error',function(err) {});

io.adapter(adapter);
*/
// -------------------------------
// ------ Socket Namespaces ------
// -------------------------------

require('./socket/admin')(io);  // Admin

// -------------------------------
