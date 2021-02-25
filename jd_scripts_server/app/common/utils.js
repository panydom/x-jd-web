'use strict';

const fs = require('fs');
const path = require('path');

/**
 * 根据env.json文件构建环境变量.env
 * @param data
 */
exports.buildEnv = function buildEnv(data) {
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

exports.requireJSON = function requireJSON(path) {
  const data = require(path);
  delete require.cache[require.resolve(path)];
  return data;
};
