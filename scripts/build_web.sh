#! /usr/bin/env bash
source ./.config

cd ./jd_scripts_web

npm run build

rm -rf ../jd_scripts_server/app/public/$CONTEXT_PATH

cp -r dist ../jd_scripts_server/app/public/$CONTEXT_PATH