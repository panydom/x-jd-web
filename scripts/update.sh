#! /usr/bin/env bash

# 更新jd_scripts

# npm i git+https://gitee.com/lxk0301/jd_scripts#master
ROOT_DIR=$(pwd)
SCRIPTS_PACKAGE_NAME=LXK9301
SCRIPTS_GIT_URL=git+https://gitee.com/lxk0301/jd_scripts#master
NODE_MODULES_DIR=${ROOT_DIR}/node_modules
if [ ! -e $NODE_MODULES_DIR ]
then
  mkdir $NODE_MODULES_DIR
fi

# jd_scripts项目路径
SCRIPTS_WORKSPACE=${NODE_MODULES_DIR}/${SCRIPTS_PACKAGE_NAME}

echo $SCRIPTS_WORKSPACE

if [ -e $SCRIPTS_WORKSPACE ]
then  
  npm i $SCRIPTS_PACKAGE_NAME
else 
  npm i $SCRIPTS_GIT_URL
fi

wget https://gitee.com/lxk0301/jd_scripts/raw/master/jdCookie.js -O $SCRIPTS_WORKSPACE/jdCookie.js
