FROM node:16

WORKDIR /server

ENV PORT 80

COPY package.json /server/package.json

EXPOSE 5000

RUN npm install

COPY . ./

CMD ["node", "server.js"]