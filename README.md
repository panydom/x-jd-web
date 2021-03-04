# 特别说明：本库不对LXK中的任何脚本做任何修改

- 本项目内所有资源文件，禁止任何公众号、自媒体进行任何形式的转载、发布。

- 本人对任何脚本问题概不负责，包括但不限于由任何脚本错误导致的任何损失或损害.

- 间接使用脚本的任何用户，包括但不限于建立VPS或在某些行为违反国家/地区法律或相关法规的情况下进行传播, 本人对于由此引起的任何隐私泄漏或其他后果概不负责.

- 如果任何单位或个人认为该项目的脚本可能涉嫌侵犯其权利，则应及时通知并提供身份证明，所有权证明，我们将在收到认证文件后删除相关脚本.

- 本仓库仅作为学习使用

# x-jd-web
web版东京薅毛羊，本仓库只是套壳，不具备任何实质功能

## 命令
### 安装

如果只是想使用，请使用仓库[x-jd-app](https://github.com/panydom/x-jd-app)

安装第一步

```bash
npm i # npm install
# 或者
yarn
```

接下来需要安装[`LXK9301`](https://gitee.com/lxk0301/jd_docker)，由于一些原因需要使用作者提供的私钥来进行安装

### 安装LXK9301(方法一)

仓库内提供了该私钥，名为`jd_id_rsa`

#### mac、linux平台

```bash
chmod 600 ./jd_id_rsa
GIT_SSH_COMMAND='ssh -i ./jd_id_rsa' npm install --no-save git+ssh://git@gitee.com:lxk0301/jd_scripts.git
```

#### windows平台

推荐使用WSL来运行

```bash
cp jd_id_rsa ~/.ssh/jd_id_rsa
chmod 600 ~/.ssh/jd_id_rsa
GIT_SSH_COMMAND='ssh -i ~/.ssh/jd_id_rsa' npm install --no-save git+ssh://git@gitee.com:lxk0301/jd_scripts.git
```

最后，复制`jdCookie`文件

```bash
cp ./jdCookie.js/node_modules/LXK9301/jdCookie.js
```

### 安装LXK9301(方法二)

```bash
GIT_SSH_COMMAND='ssh -i ./jd_id_rsa' git clone --depth=1 git@gitee.com:lxk0301/jd_scripts.git
npm link ./jd_scripts
cd jd_scripts && npm i 
```

### 开启项目之后安装(方法三)

在`脚本管理`页面右上角放置了一个可以更新的脚本的按钮，通过配置`.env.bak`文件`INSTALL_SCRIPTS_ON_START=true`可以实现启动的时候安装的scripts的功能。启动应用之后每2小时都会更新一次




### 运行

```bash
# 启动
npm start
# open http://localhost:7801

# 停止
npm run stop

# 重启
npm run restart
```

> 注： 启动时候的参数配置在`.config`中修改

### 贡献

```bash
npm run dev
# open http://localhost:8000
```

> jd_scripts_web项目使用umi搭建、jd_scripts_server使用egg搭建