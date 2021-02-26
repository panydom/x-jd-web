#! /usr/bin/env bash

# 更新jd_scripts

# npm i git+https://gitee.com/zixing/jd_scripts.git#master
# SCRIPTS_GIT_URL=git+https://gitee.com/zixing/jd_scripts.git#master

ROOT_DIR=$(pwd)
echo "ROOT_DIR >> $ROOT_DIR"
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

# if [ '$APP_ENV' == 'heroku' ]
# then
chmod 600 ./jd_id_rsa
export GIT_SSH_COMMAND='ssh -i ./jd_id_rsa' 
# else
#   rm ~/.ssh/jd_id_rsa
#   cp ./jd_id_rsa ~/.ssh/jd_id_rsa
#   chmod 600 ~/.ssh/jd_id_rsa

#   export GIT_SSH_COMMAND='ssh -i ~/.ssh/jd_id_rsa' 
# fi
GIT_SSH_COMMAND='ssh -i ./jd_id_rsa' git clone --depth=1 git@gitee.com:lxk0301/jd_scripts.git 

npm link ./jd_scripts

cd jd_scripts && npm i 


# npm install --no-save git+ssh://git@gitee.com:lxk0301/jd_scripts.git

# cp ./jdCookie.js $SCRIPTS_WORKSPACE/jdCookie.js
