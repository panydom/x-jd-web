'use strict';

const fs = require('fs');
const path = require('path');

/**
 * 根据env.json文件构建环境变量.env
 * @param data
 */
const buildEnv = exports.buildEnv = function buildEnv(data) {
  const env = data || require('../../env.json');
  const writeStream = fs.createWriteStream(path.join(__dirname, '../../.env'));
  for (const config of env) {
    const { title, fields } = config;
    writeStream.write(`----------${title}----------\n`);
    for (const field of fields) {
      const { title, summary, id } = field;
      let { value } = field;
      if (id === 'JD_COOKIE') {
        value = value.map(user => `pt_key=${user.pt_key};pt_pin=${user.pt_pin};`);
        value = value.join('&');
      }
      // else if (id === 'JOY_TEAM_LEVEL') {
      //   value = (value || []).join('&');
      // }
      writeStream.write(`# ${title}\n`);
      writeStream.write(`# ${summary}\n`);
      writeStream.write(`${id}=${value}\n`);
      writeStream.write('\n');
    }
    writeStream.write('\n\n');
  }
  writeStream.end();
};

const requireJSON = exports.requireJSON = function requireJSON(path) {
  const data = require(path);
  delete require.cache[require.resolve(path)];
  return data;
};

const writeJSONSync = exports.writeJSONSync = function writeJSONSync(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, ' '));
};

// 创建脚本运行的环境变量脚本
exports.createEnv = function(bakFile, envFile) {
  if (!fs.existsSync(envFile)) {
    // execa('cp', [ EnvFileBak, EnvFile ]);
    fs.writeFileSync(envFile, fs.readFileSync(bakFile));
  } else {
    const env = requireJSON(envFile);
    const bak = fs.readFileSync(bakFile);
    // 修改过数据的环境变量
    const envData = env.reduce((data, config) => {
      const fields = config.fields.filter(field => field.value);
      return [ ...data, ...fields ];
    }, []);
    if (bak) {
      const bakData = JSON.parse(bak);
      const newEnvData = bakData.map(config => {
        return {
          ...config,
          fields: config.fields.map(field => {
            const oldData = envData.find(data => data.id === field.id);
            if (oldData) {
              return oldData;
            }
            return field;
          }),
        };
      });
      writeJSONSync(envFile, newEnvData);
    }
  }
  buildEnv();
};
