FROM node:12

RUN npm install -g serve
COPY . .
RUN npm ci
RUN npm run build
 
EXPOSE 3000

CMD ["serve", "-s", "build"]