FROM node

RUN mkdir -p /home/app

WORKDIR /home/app

COPY package*.json ./

RUN yarn install 

COPY . .

EXPOSE 4000

CMD yarn start