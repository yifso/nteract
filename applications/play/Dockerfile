FROM node:8@sha256:09cf39a09c227a0c4f8df7b864fb1c32462166669172628f86cb45d87e7aac2f
ADD . /playground
WORKDIR /playground
RUN npm install && npm run build

EXPOSE 3000

CMD ["/playground/node_modules/.bin/next", "start", "--host", "0.0.0.0"]
