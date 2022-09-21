FROM node:16-alpine as BUILDER

WORKDIR /app
COPY . .

RUN npm install . \
    && npm run build \
    && npm cache clean --force


FROM node:16-alpine as final

WORKDIR /app
COPY --from=BUILDER /app .

ENTRYPOINT ["npm"]
CMD ["run", "start"]