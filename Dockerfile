# =============================================================================
# NodeJS Static Assets
# =============================================================================
FROM node:22@sha256:3218f0d1b9e4b63def322e9ae362d581fbeac1ef21b51fc502ef91386667ce92 AS client

RUN mkdir -p /oscarbundles/server /oscarbundles/client
WORKDIR /oscarbundles/client

RUN apt-get update && \
    apt-get install -y gettext && \
    rm -rf /var/lib/apt/lists/*

# Install node_modules
ADD client/package.json /oscarbundles/client/package.json
ADD client/package-lock.json /oscarbundles/client/package-lock.json
RUN npm ci
VOLUME /oscarbundles/client/node_modules

# Include NPM's .bin directory in the sys path
ENV PATH=/oscarbundles/client/node_modules/.bin:$PATH

# Add source
ADD client/ /oscarbundles/client/

# Compile static assets
ENV NODE_ENV=production
RUN webpack

# Set entry point so that packages are always updated before compiling things
ENTRYPOINT ["/oscarbundles/client/entrypoint.sh"]
CMD ["webpack", "--watch"]


# =============================================================================
# Python / Django Application Server
# =============================================================================
FROM registry.gitlab.com/thelabnyc/python:3.13.892@sha256:7f2a493f9c96c6a8999c9f3f20499d5c2e3a191d6c506fb8f01ab50ec2197641 AS server

RUN mkdir -p /oscarbundles/server /oscarbundles/client
WORKDIR /oscarbundles/server

RUN apt-get update && \
    apt-get install -y gettext && \
    rm -rf /var/lib/apt/lists/*

COPY server/ /oscarbundles/server/
RUN uv sync

RUN mkdir /oscarbundles/tox
ENV TOX_WORK_DIR='/oscarbundles/tox'

CMD ["python", "sandbox/manage.py", "runserver"]
