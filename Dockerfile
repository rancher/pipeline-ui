FROM node:7
RUN mkdir /source
WORKDIR /source
COPY package.json bower.json ./
COPY scripts ./scripts
# Make it faster when build in China.
RUN npm config set registry=http://registry.npm.taobao.org && yarn config set registry https://registry.npm.taobao.org
RUN yarn install && yarn global add bower && bower --allow-root install && yarn cache clean && bower --allow-root cache clean
# RUN yarn install && yarn global add bower phantomjs-prebuilt && bower --allow-root install && yarn cache clean && bower --allow-root cache clean
COPY . /source
EXPOSE 8000
# CMD ["yarn","start","--","--ssl=false"]
CMD ["sh","./scripts/format_env"]
