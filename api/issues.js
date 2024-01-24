/*
 * @Author: DivinerWJ
 * @Date: 2021-05-27 17:23:06
 * @LastEditors: DivinerWJ
 * @LastEditTime: 2021-05-28 12:58:09
 * @Description: issues
 * @FilePath: /weixin/Users/wangjie/Documents/study/github/notes/src/项目工程化/commitlint-plugin-with-jira-issue/api/issues.js
 */

const { http } = require("./_http");

/**
 * @description: GET /rest/api/2/issue/{issueIdOrKey}
 * @param {String} issueIdOrKey issueIdOrKey
 * @return {Response} Returns the details for an issue.
 */
const getIssue = (issueIdOrKey = "") => http.get(`/issue/${issueIdOrKey}`);

module.exports = {
  getIssue,
};
