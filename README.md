# x-jd-web
web版东京薅毛羊

## 命令
### 安装

```bash
npm i

# 如果安装失败，删除package.json中的LXK9301这条信息，并手动执行以下命令
cp jd_id_rsa ~/.ssh/jd_id_rsa
chmod 600 ~/.ssh/jd_id_rsa
GIT_SSH_COMMAND='ssh -i ~/.ssh/jd_id_rsa' npm install --no-save git+ssh://git@gitee.com:lxk0301/jd_scripts.git
```

### 运行相关

```bash
# 启动
npm start
# open http://localhost:7801

# 停止
npm run stop

# 重启
npm run restart
```

> 注： 启动时候的参数配置在`scripts/start.sh`中，从`scripts/egg.sh`修改

### 开发相关

```bash
npm run dev
# open http://localhost:8000
```

> jd_scripts_web项目使用umi搭建、jd_scripts_server使用egg搭建