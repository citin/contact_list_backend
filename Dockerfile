FROM python:3.6


ENV PYTHONUNBUFFERED 1

# Set locales
# RUN apt-get update -qq && apt-get install -y locales
# RUN echo 'en_US.UTF-8 UTF-8' >> /etc/locale.gen && locale-gen

# Copy all files to the /app directory.
RUN mkdir -p /app/
WORKDIR /app/
ADD . /app/

# Install python dependencies using pip.
RUN pip install -r requirements.txt

RUN python manage.py migrate

RUN python manage.py loaddata contact_list_backend/fixtures/*

CMD python manage.py runserver 0.0.0.0:8080

