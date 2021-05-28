/*
 * @Author: wangjie59
 * @Date: 2021-05-28 10:28:43
 * @LastEditors: wangjie59
 * @LastEditTime: 2021-05-28 15:48:51
 * @Description: load配置
 * @FilePath: /weixin/Users/wangjie/Documents/study/test/commitlint-plugin-with-jira-issue/lib/load.js
 */

const path = require("path");
const directoryPath = path.join(path.resolve(), ".demand.js");
const {
  JIRA_PROJECT,
  domain,
  apiVersion,
  issueId,
  assignee,
  developers,
  devfield,
  indeterminate,
  dueDate,
  dueDatelimit,
  token,
} = require(directoryPath);

module.exports = {
  JIRA_PROJECT,
  domain,
  apiVersion: apiVersion || "/rest/api/2",
  issueId: issueId || "10001",
  assignee: (typeof (assignee) === "boolean") ? assignee : true,
  developers: (typeof (developers) === "boolean") ? developers : true,
  devfield: devfield || "customfield_11637",
  indeterminate: (indeterminate && parseInt(indeterminate, 10)) || 4,
  dueDate: (typeof (dueDate) === "boolean") ? dueDate : true,
  dueDatelimit: (dueDatelimit && parseInt(dueDatelimit, 10)) || 0,
  token,
};
