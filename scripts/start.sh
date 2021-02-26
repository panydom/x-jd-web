#! /usr/bin/env bash

# ./scripts/build_web.sh

. ./scripts/egg.sh

cd jd_scripts_server

echo 'title >> '$title

echo 'port >> '$port

echo 'APP_ENV >> '$APP_ENV

npx egg-scripts start --port=$port --daemon --title=$title