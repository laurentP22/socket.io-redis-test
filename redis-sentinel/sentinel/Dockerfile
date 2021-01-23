FROM redis:alpine

WORKDIR /app

COPY ./etc ./etc

CMD ["redis-sentinel", "./etc/sentinel.conf"]