FROM node:16.14.2-alpine3.15
COPY package.json .
RUN npm install
COPY . .
EXPOSE 4000

# start app
CMD ["npm", "start"]