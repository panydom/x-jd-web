#! /usr/bin/env bash

if [ $1 == '--build-web' ]
then
  ./scripts/build_web.sh
fi

source .config

cd jd_scripts_server

echo 'title >> '$title

echo 'port >> '$port

# 更多参数查看 https://eggjs.org/zh-cn/core/deployment.html#%E5%90%AF%E5%8A%A8%E5%91%BD%E4%BB%A4

npx egg-scripts start --port=$port --daemon --title=$title