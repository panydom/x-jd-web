#! /usr/bin/env bash

# ./scripts/build_web.sh

. ./scripts/egg.sh

cd jd_scripts_server

echo 'title >> '$title

echo 'port >> '$port

echo 'APP_ENV >> '$APP_ENV


serv_port=

if [ ! $PORT ]; then
  serv_port=$port
else
  serv_port=$PORT
fi
echo '$serv_port >> '$serv_port

npx egg-scripts start --port=$serv_port --title=$title