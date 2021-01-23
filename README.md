# Socket.io redis test
A simple project to learn how to use socket.io with redis.

I was working on socket.io and redis when I noticed some strange behaviors. I decided to create a little project in order to confirm the problems... 

This project uses docker to build 5 containers more the redis environment:

- 1 frontend in vuejs
- 3 servers in nodejs
- 1 Nginx to balance the traffic

## Installation
### Redis environment
First, start the redis environment of your choice: redis-cluster, redis-sentinel or redis-standalone.

PS: See the README.md of the environment choosen.

### Start nginx, the front and the servers:
Before to start the micro-services, you need to :
- Edit the docker-compose.yml of the root folder by setting the network corresponding to the environment choosen (redis-cluster-env, redis-sentinel-env or redis-standalone).
- Edit the index.js file inside the node-socket folder by commenting/uncommenting the section wanted.


From the root of the project and run :

```sh
    docker-compose up --build
```

If everything goes well, you should be able to open your browser ( http://localhost:3050/ ) and see :

```
 Welcome to the admin page, connected : true
```

In the page you can see a button "Get all rooms", this button emits an event which should print all the rooms created in the terminal.
This is where I have seen strange behaviors, see repport.md