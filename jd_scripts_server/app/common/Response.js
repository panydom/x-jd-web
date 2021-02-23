'use strict';

class Res {
  constructor(data, errCode = 0, errMsg = '') {
    this.errCode = errCode;
    this.errMsg = errMsg;
    this.data = data;
  }
}

module.exports = Res;
