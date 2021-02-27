#! /usr/bin/env bash

 ./scripts/build_web.sh

. ./scripts/egg.sh

cd jd_scripts_server

echo 'title >> '$title

echo 'port >> '$port

serv_port=7801

if [ ! -n $PORT ]; then
  serv_port=$PORT
elif [ ! -n $port]
then
  serv_port=$port
fi

echo '$serv_port >> '$serv_port

npx egg-scripts start --port=$serv_port --daemon --title=$title