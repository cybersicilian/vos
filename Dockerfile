FROM node:18

WORKDIR /usr/src/app

COPY . .
EXPOSE 15192
CMD ["node", "index.js"]