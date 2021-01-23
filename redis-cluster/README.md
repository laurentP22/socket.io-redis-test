# Testing Environment
A simple enviromnemt composed of a redis cluster ( 3 masters, 0 slaves)

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
```

## Build the redis-cluster

As redis doesn't support hostname, to build the cluster we need the ip of the containers.

In the docker-compose.yml, a label is attached to every redis container ( role=redis-cluster ).

Use the following command to have the ip of the container with the label :
    
```sh
    ip=$(docker ps -q -f "label=role=redis-cluster" | xargs -n 1 docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}:6379')
```

Then display the result with :
```sh
    echo $ip
```
Copy the list of ip:port and open a redis container ( the one that you want, I use the redis-1) :
```sh
    docker exec -it redis-1 sh
```

Build the cluster using the following command with the list of ip:port previously copied :
```sh
    redis-cli --cluster create X.X.X.X:6379 X.X.X.X:6379 X.X.X.X:6379 X.X.X.X:6379 X.X.X.X:6379 X.X.X.X:6379 --cluster-replicas 1
```

If everything goes well, you should see :
```
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
```