FROM node:16-alpine

WORKDIR /app
COPY . .

RUN npm install

RUN npm run build

ENTRYPOINT ["npm"]
CMD ["run", "start"]
