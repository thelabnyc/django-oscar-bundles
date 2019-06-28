FROM node:10

RUN mkdir -p /oscarbundles/server /oscarbundles/client
WORKDIR /oscarbundles/client

RUN apt-get update && \
    apt-get install -y gettext && \
    rm -rf /var/lib/apt/lists/*

# Install node_modules
ADD client/package.json /oscarbundles/client/package.json
ADD client/yarn.lock /oscarbundles/client/yarn.lock
RUN yarn
VOLUME /oscarbundles/client/node_modules

# Include NPM's .bin directory in the sys path
ENV PATH /oscarbundles/client/node_modules/.bin:$PATH
ENV NODE_ENV production

# Add source
ADD client/ /oscarbundles/client/

# Set entry point so that packages are always updated before compiling things
ENTRYPOINT ["/oscarbundles/client/entrypoint.sh"]
CMD ["webpack", "--watch"]
