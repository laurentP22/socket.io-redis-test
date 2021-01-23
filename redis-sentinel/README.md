# Testing Environment
A simple enviromnemt composed of :

- 1 redis-master
- 1 redis-slave
- 3 redis-sentinel

## Installation

```sh
    docker-compose up --build -d
```

Check that all the containers are running:

```sh
    docker-compose ps
```
You should see :

```
 Name                Command               State    Ports  
-----------------------------------------------------------
redis-1   docker-entrypoint.sh redis ...   Up      6379/tcp
redis-2   docker-entrypoint.sh redis ...   Up      6379/tcp
redis-3   docker-entrypoint.sh redis ...   Up      6379/tcp
redis-a   docker-entrypoint.sh redis ...   Up      6379/tcp
redis-b   docker-entrypoint.sh redis ...   Up      6379/tcp
```
