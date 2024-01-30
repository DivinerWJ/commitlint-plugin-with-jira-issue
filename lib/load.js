/*
 * @Author: DivinerWJ
 * @Date: 2021-05-28 10:28:43
 * @LastEditors: DivinerWJ
 * @LastEditTime: 2024-01-30 08:59:42
 * @Description: load配置
 * @FilePath: /commitlint-plugin-with-jira-issue/lib/load.js
 */

const path = require("path");
const directoryPath = path.join(path.resolve(), ".demand.js");
const {
  JIRA_PROJECT,
  domain,
  apiVersion,
  issueId,
  storyId,
  assignee,
  developers,
  devfield,
  indeterminate,
  dueDate,
  dueDatelimit,
  checkPFDate,
  checkPFDatefield,
  token,
} = require(directoryPath);

const getJiraProject = (project) => {
  if (!project) {
    return [];
  }
  if (Array.isArray(project)) {
    return project.filter(j => typeof j === 'string' && j && j.trim()).map(j => j.trim());
  }

  if (typeof project === 'string' && project.trim()) {
    return [project.trim()];
  }

  return [];
}

console.log(getJiraProject([]));


module.exports = {
  JIRA_PROJECT: getJiraProject(),
  domain,
  apiVersion: apiVersion || "/rest/api/2",
  issueId: (Array.isArray(issueId) && issueId.length) ? issueId : ["10001"],
  storyId: storyId || "10001",
  assignee: (typeof (assignee) === "boolean") ? assignee : true,
  developers: (typeof (developers) === "boolean") ? developers : true,
  devfield: devfield || "customfield_11637",
  indeterminate: (indeterminate && parseInt(indeterminate, 10)) || 4,
  dueDate: (typeof (dueDate) === "boolean") ? dueDate : true,
  dueDatelimit: (dueDatelimit && parseInt(dueDatelimit, 10)) || 0,
  checkPFDate: (typeof (checkPFDate) === "boolean") ? checkPFDate : true,
  checkPFDatefield: checkPFDatefield || "customfield_13632",
  token,
};
