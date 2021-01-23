FROM redis:alpine

WORKDIR /app

COPY ./etc ./etc

CMD ["redis-server", "./etc/redis.conf"]