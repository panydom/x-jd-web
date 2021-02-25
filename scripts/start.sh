#! /usr/bin/env bash

./scripts/build_web.sh

. ./scripts/egg.sh

cd jd_scripts_server

npx egg-scripts start --port=$port --daemon --title=$title