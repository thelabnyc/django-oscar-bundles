# =============================================================================
# NodeJS Static Assets
# =============================================================================
FROM node:24@sha256:19cd848a0e073d34bd8cd5545a1b6b4d28489b3e3b607366621ced442bd5f6b4 AS client

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
FROM registry.gitlab.com/thelabnyc/python:3.14@sha256:0fa951451b63f5bffd9e7e87396c3d8c256e345ae20f0f86b90ea3c7cbb0bad1 AS server

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
