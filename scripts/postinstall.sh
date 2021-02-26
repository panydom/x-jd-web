#! /usr/bin/env bash
# ./scripts/update.sh

cd ./jd_scripts_web

npm i --force

cd ../jd_scripts_server

npm i --legacy-peer-deps