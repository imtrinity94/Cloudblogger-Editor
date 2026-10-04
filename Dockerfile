# Static site: nginx serves public/ (the engine jars are prebuilt in public/engines).
FROM nginx:alpine

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY public/ ./

# CheerpJ fetches jars with HTTP Range requests; nginx supports them and already
# maps .jar to application/java-archive.

EXPOSE 80
