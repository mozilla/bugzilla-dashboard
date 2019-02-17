#!/usr/bin/env bash

cp ../../yarn.lock .
yarn build
git init
heroku git:remote -a bugzilla-dashboard-temp-server
git add build package.json yarn.lock phonebook.json Procfile
git commit -am "Deploy server to Heroku"
git push heroku master -f
rm -rf .git yarn.lock
