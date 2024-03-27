
FROM --platform=amd64 python:3.8-slim

WORKDIR /app


COPY . /app


RUN apt-get update && \
    apt-get install -y --no-install-recommends chromium-driver && \
    pip install --trusted-host pypi.python.org -r requirements.txt


EXPOSE 8376


ENV FLASK_APP=app.py


CMD ["flask", "run", "--host=0.0.0.0", "--port=8376"]
