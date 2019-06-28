FROM python:3.7

RUN mkdir -p /oscarbundles/server /oscarbundles/client
WORKDIR /oscarbundles/server

RUN apt-get update && \
    apt-get install -y gettext && \
    rm -rf /var/lib/apt/lists/*

ADD server/ /oscarbundles/server/
RUN pip install -e .[development]

RUN mkdir /oscarbundles/tox
ENV TOX_WORK_DIR='/oscarbundles/tox'

CMD ["python", "sandbox/manage.py", "runserver"]
