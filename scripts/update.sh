#! /usr/bin/env bash

# 更新jd_scripts

# npm i git+https://gitee.com/zixing/jd_scripts.git#master
ROOT_DIR=$(pwd)
# SCRIPTS_GIT_URL=git+https://gitee.com/zixing/jd_scripts.git#master
NODE_MODULES_DIR=${ROOT_DIR}/node_modules
if [ ! -e $NODE_MODULES_DIR ]
then
  mkdir $NODE_MODULES_DIR
fi

# jd_scripts项目路径
SCRIPTS_PACKAGE_NAME=LXK9301
SCRIPTS_WORKSPACE=${NODE_MODULES_DIR}/${SCRIPTS_PACKAGE_NAME}

# echo $SCRIPTS_WORKSPACE

# if [ -e $SCRIPTS_WORKSPACE ]
# then  
#   npm i $SCRIPTS_PACKAGE_NAME
# else 
#   npm i $SCRIPTS_GIT_URL
# fi

cp ./jd_id_rsa ~/.ssh/jd_id_rsa
chmod 600 ~/.ssh/jd_id_rsa
GIT_SSH_COMMAND='ssh -i ~/.ssh/jd_id_rsa' npm install git+ssh://git@gitee.com:lxk0301/jd_scripts.git

# wget https://gitee.com/zixing/jd_scripts/raw/master/jdCookie.js -O $SCRIPTS_WORKSPACE/jdCookie.js

cp ./jdCookie.js $SCRIPTS_WORKSPACE/jdCookie.js
