FROM node:15

WORKDIR /app

COPY . .

RUN npm install

RUN npm uninstall bcrypt
RUN npm i bcrypt

CMD ["npm", "start"]
