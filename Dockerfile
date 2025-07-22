# =============================================================================
# NodeJS Static Assets
# =============================================================================
FROM node:22@sha256:079b6a683dc47a87673a6159c9e9b22b0687d04533087cf144c96fac8c26ecd3 AS client

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
FROM registry.gitlab.com/thelabnyc/python:3.13.836@sha256:2ba7e85ccf62e5c19fb135ce758e270032e30b465856d012c55240020a3755c0 AS server

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
