'use strict';

const crypto = require('crypto');
const axios = require('axios');

class CVideoApi {
  constructor(key, secret, host, port){
    this.key = key;
    this.secret = secret;
    host = host || 'localhost';
    port = port || 80;
    this.base_url = `http://${host}:${port}/sso/api/v1`
  }

  getToken(params) {
    params = params || {};
    let stringBuffer = [this.secret];
    Object.keys(params).sort().forEach( key=> {
      stringBuffer.push(key);
      stringBuffer.push(params[key]);
    });
    return crypto.createHash('md5').update(stringBuffer.join('')).digest('hex');
  }

  async listDevices() {
    let params = {
      token: this.getToken(),
      timestamp: Math.floor(new Date() / 1000),
      appkey: this.key
    };
    let response = await axios.get(`${this.base_url}/trees/client`, {
      params
    });
    if (response.status != 200) {
      throw `Received response with error: ${response.status}`;
    }
    return response.data; 
  }

  async getUrl(id, centertype) {
    let params = {
      centertype: centertype || 1,
      id
    };
    let token = this.getToken(params);
    params.token = token;
    params.appkey = this.key;
    params.timestamp = Math.floor(new Date() / 1000);
    let response = await axios.get(`${this.base_url}/real/urls`, {
      params
    });
    if (response.status != 200) {
      throw `Received response with error: ${response.status}`;
    }
    return response.data; 
  }

}

module.exports = CVideoApi;
