# backend/run_backend.sh

#!/bin/bash

# TODO: Write automation script for launching BE app
source django-env/bin/activate

pip install -r requirements.txt
python manage.py makemigrations 
python manage.py migrate
python manage.py loaddata user/fixtures/badge-data.json
python manage.py loaddata user/fixtures/user-data.json
python manage.py loaddata report/fixtures/report-data.json
python manage.py loaddata hashtag/fixtures/hashtag-data.json
python manage.py loaddata post/fixtures/post-data.json
python manage.py loaddata post/fixtures/posthashtag-data.json
# mkdir -p /log # for `uwsgi` logging 
sudo mkdir -p /home/ubuntu/log
uwsgi --ini uwsgi/uwsgi.ini