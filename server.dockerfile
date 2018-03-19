FROM python:3.6
ENV PYTHONUNBUFFERED 0

RUN mkdir -p /oscarbundles/server /oscarbundles/client
WORKDIR /oscarbundles/server

ADD server/requirements.txt /oscarbundles/server/
RUN pip install -r requirements.txt

ADD server/ /oscarbundles/server/
RUN pip install -e .[development]

RUN mkdir /oscarbundles/tox
ENV TOX_WORK_DIR='/oscarbundles/tox'

CMD ["python", "sandbox/manage.py", "runserver"]
