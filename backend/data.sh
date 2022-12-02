#!/bin/sh
python manage.py makemigrations
python manage.py migrate
python manage.py loaddata user/fixtures/badge-data.json
python manage.py loaddata user/fixtures/user-data.json
python manage.py loaddata report/fixtures/report-data.json
python manage.py loaddata hashtag/fixtures/hashtag-data.json
python manage.py loaddata post/fixtures/post-data.json
python manage.py loaddata post/fixtures/posthashtag-data.json
python manage.py runserver