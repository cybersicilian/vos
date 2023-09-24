FROM oven/bun

WORKDIR /usr/src/app

COPY . .
EXPOSE 15912
CMD ["bun", "run", "index.js"]