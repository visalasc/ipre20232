FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

RUN npm run build

EXPOSE 8080

CMD [ "yarn", "run", "preview" ]