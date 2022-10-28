# NowSee

[![Build Status](https://app.travis-ci.com/swsnu/swppfall2022-team6.svg?branch=main)](https://app.travis-ci.com/swsnu/swppfall2022-team6)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=swsnu_swppfall2022-team6&metric=alert_status)](https://sonarcloud.io/dashboard?id=swsnu_swppfall2022-team6)

## Frontend

```bash
cd frontend
yarn
yarn start
```

## Frontend Test

```bash
cd frontend
yarn
yarn test --coverage --watchAll=false
```

## Backend

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Backend Test

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
