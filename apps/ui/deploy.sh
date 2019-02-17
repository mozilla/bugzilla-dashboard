#!/usr/bin/env bash

cp ../../yarn.lock .
git init
heroku git:remote -a bugzilla-dashboard-temp
git add src package.json yarn.lock .neutrinorc.js .eslintignore .eslintrc.js webpack.config.js static.json
git commit -am "Deploy ui to Heroku"
git push heroku master -f
rm -rf .git yarn.lock
