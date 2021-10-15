ARG NODE_VERSION

# build environment
FROM node:${NODE_VERSION}-buster

# set working directory
WORKDIR /var/www/frontend

# add `/app/node_modules/.bin` to $PATH
ENV PATH /var/www/frontend/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# add app
COPY . ./

# start app
CMD ["npm", "start"]