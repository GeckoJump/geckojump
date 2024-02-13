FROM python:3.11.4-slim-buster

# Prevents Python from writing pyc files to disc
ENV PYTHONDONTWRITEBYTECODE 1
# Prevents Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED 1

WORKDIR /app

RUN pip3 install --upgrade pip
COPY requirements.txt /app
RUN pip3 install -r requirements.txt

COPY . /app

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]



