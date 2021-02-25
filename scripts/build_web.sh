#! /usr/bin/env bash

cd ./jd_scripts_web

npm run build

rm -rf ../jd_scripts_server/app/public/web

cp -r dist ../jd_scripts_server/app/public/web