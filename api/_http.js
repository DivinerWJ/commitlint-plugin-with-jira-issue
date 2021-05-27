/*
 * @Author: wangjie59
 * @Date: 2021-05-26 17:47:03
 * @LastEditors: wangjie59
 * @LastEditTime: 2021-05-27 21:29:01
 * @Description: _http
 * @FilePath: /weixin/Users/wangjie/Documents/study/test/commitlint-plugin-with-jira-issue/api/_http.js
 */
const path = require("path");
const fetch = require('node-fetch');
const directoryPath = path.join(path.resolve(), '.demand.js');
const { domain, apiVersion, token } = require(directoryPath);

/**
 * @description: 检查响应状态
 * @param {*} response
 * @return {*}
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) { // 响应成功
    return response;
  }
  if (response.status === 301 || response.status === 302) { // 重定向
    // window.location = response.headers.get('Location');
  }
  const error = new Error(response.statusText);
  error.data = response;
  throw error;
}

/**
 * @description: 解析返回的结果
 * @param {*} response
 * @return {*}
 */
async function parseResult(response) {
  const contentType = response.headers.get('Content-Type');
  if (contentType != null) {
    if (contentType.indexOf('text') > -1) {
      return await response.text();
    }
    if (contentType.indexOf('form') > -1) {
      return await response.formData();
    }
    if (contentType.indexOf('video') > -1) {
      return await response.blob();
    }
    if (contentType.indexOf('json') > -1) {
      return await response.json();
    }
  }
  return await response.text();
}

/**
 * @description: 解析结果
 * @param {*} response
 * @return {*}
 */
async function processResult(response) {
  let _response = checkStatus(response);
  _response = await parseResult(_response);
  return _response;
}

/**
 * @description: 发起请求
 * @param {String} url jira api
 * @param {Object} init 请求配置
 * @param {Headers} header headers自定义
 * @return {Response} 接口回参
 */
async function _request(url, init, headers = {}) {
  const options = Object.assign(
    {
      credentials: 'include'// 允许跨域
    },
    init
  );
  options.headers = Object.assign({}, options.headers || {}, headers || {});
  let response = await fetch(url, options);
  response = await processResult(response);// 这里是对结果进行处理。包括判断响应状态和根据response的类型解析结果
  return response;
}

/**
 * @description: 获取options
 * @param {String} url jira api
 * @param {Object} options 请求配置
 * @param {Headers} header headers自定义
 * @return {Object} 处理后的url和options {url, options}
 */
function initOptions(url, options, header) {
  url = `${domain}${apiVersion}${url}`;
  options = Object.assign({
    method: "GET",
    headers: Object.assign({
      // 'Authorization': `Basic ${Buffer.from(
      //   `${user}:${token}`
      'Authorization': `Basic ${token}`,
      'Accept': 'application/json'
    }, header)
  }, options);

  return {
    url,
    options,
  };
}

class Http {
  // get
  async get(url, options, header) {
    const {url: URL, options: OPTIONS} = initOptions(url, options, header);
    return await _request(URL, OPTIONS);
  }

  // post
  async post(url, options, header) {
    const {url: URL, options: OPTIONS} = initOptions(url, options, header);
    OPTIONS.method = 'POST';
    OPTIONS.body = JSON.stringify(OPTIONS.data);
    return await _request(URL, OPTIONS);
  }
}

const http = new Http();

module.exports = {
  http,
};

