/*
 * @Author: wangjie59
 * @Date: 2021-05-27 17:23:06
 * @LastEditors: wangjie59
 * @LastEditTime: 2021-05-27 21:29:15
 * @Description: issues
 * @FilePath: /weixin/Users/wangjie/Documents/study/test/commitlint-plugin-with-jira-issue/api/issues.js
 */

const { http } = require('./_http');

/**
 * @description: GET /rest/api/2/issue/{issueIdOrKey}
 * @param {String} issueIdOrKey issueIdOrKey
 * @return {Response} Returns the details for an issue.
 */
const getIssue = (issueIdOrKey = '') => http.get(`/issue/${issueIdOrKey}`);

module.exports = {
  getIssue,
};
