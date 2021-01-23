# Testing Environment
A simple enviromnemt composed of a redis cluster ( 3 masters, 3 slaves)

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
```