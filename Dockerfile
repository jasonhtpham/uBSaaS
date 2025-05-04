
FROM node:16-alpine

RUN apk add --update imagemagick && \
    apk add --update graphicsmagick && \
    apk add --update ffmpeg && \
    apk add --update bash

WORKDIR /app 
COPY . . 

EXPOSE 8080

RUN npm cache clean --force
RUN npm install --silent
RUN cp .env.example .env
RUN PROJECT_FOLDER=schare-bucket bash setup_upload.sh

CMD ["npm", "start"]