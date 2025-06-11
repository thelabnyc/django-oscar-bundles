# =============================================================================
# NodeJS Static Assets
# =============================================================================
FROM node:22@sha256:6a2972b55a5032ed961f5239c7a829c439fb54fc1d99ca5dccb2094860a47b97 as client

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
ENV PATH /oscarbundles/client/node_modules/.bin:$PATH

# Add source
ADD client/ /oscarbundles/client/

# Compile static assets
ENV NODE_ENV production
RUN webpack

# Set entry point so that packages are always updated before compiling things
ENTRYPOINT ["/oscarbundles/client/entrypoint.sh"]
CMD ["webpack", "--watch"]


# =============================================================================
# Python / Django Application Server
# =============================================================================
FROM registry.gitlab.com/thelabnyc/python:3.13.737@sha256:407e710f73e88a66ab3ccb868211496f7c85e034fc752464c02d2dc50ba6316d as server

RUN mkdir -p /oscarbundles/server /oscarbundles/client
WORKDIR /oscarbundles/server

RUN apt-get update && \
    apt-get install -y gettext && \
    rm -rf /var/lib/apt/lists/*

COPY server/ /oscarbundles/server/
RUN poetry install

RUN mkdir /oscarbundles/tox
ENV TOX_WORK_DIR='/oscarbundles/tox'

CMD ["python", "sandbox/manage.py", "runserver"]
