/*
 * @Author: wangjie59
 * @Date: 2021-05-27 19:10:30
 * @LastEditors: wangjie59
 * @LastEditTime: 2021-05-27 21:29:22
 * @Description: 
 * @FilePath: /weixin/Users/wangjie/Documents/study/test/commitlint-plugin-with-jira-issue/lib/util.js
 */

const path = require("path");

const directoryPath = path.join(path.resolve(), '.demand.js');
const { domain, user } = require(directoryPath);
const { getIssue } = require('../api/issues');

/**
 * @description: 获取日期差
 * @param {Date} targetDate 目标日期
 * @return {Float} 日期差
 */
function getDiffDate(targetDate) {
  let r = new Date(targetDate);
  let n = new Date();
  n = new Date(n.getFullYear(), n.getMonth(), n.getDate());
  const diff = r.getTime() - n.getTime();
  const d = diff / (24 * 60 * 60 * 1000);  
  return d;
}

const getIssueDetails = async (demand) => {
  try {
    const res = await getIssue(demand);
    if (!res || !res.fields || !res.fields.issuetype || (res.fields.issuetype.id !== "10001")) {
      // 这不是一个有效的故事
      return [
        false,
        `这不是一个有效的故事
        check: ${res.self}`,
      ];
    }
    let haveDev = res.fields.customfield_11637 && res.fields.customfield_11637.some(i => i.name === user.toUpperCase());
    if (!haveDev) {
      // 开发人员不对
      return [
        false,
        `开发人员不是你，最好检查一下
        devs: ${(res.fields.customfield_11637.length && res.fields.customfield_11637.map(i => i.name)) || "none"}`,
      ];
    }
    // // 经办人
    // if (!res.fields.assignee || (res.fields.assignee.name === user.toUpperCase())) {
    //   // 经办人不对
    //   return [
    //     false,
    //     `经办人不是你，最好检查一下
    //     assignee: ${(res.fields.assignee && res.fields.assignee.name) || "none"}`,
    //   ];
    // }
    if (!res.fields.duedate || (getDiffDate(res.fields.duedate) <= 1)) {
      // 即将到期，注意一下
      return [
        false,
        '到期日不对或者即将到期或者已经超期，注意一下',
      ];
    }
    console.table({
      "issue 链接:": `${domain}/browse/${demand}`,
      "issue 状态:": (res.fields.status && res.fields.status.name) || "don't know",
      "issue 状态分类:": (res.fields.status && res.fields.status.statusCategory && res.fields.status.statusCategory.name) || "don't know",
      "经办人": (res.fields.assignee && res.fields.assignee.name) || "none",
      "是否为开发人员:": haveDev,
      "到期日:": res.fields.duedate || "Invalid Date",
    });
    return [
      true
    ]
  } catch (error) {
    return [
      false,
      `这不是一个有效的问题\n
      view: ${error.errorMessages || "查询问题不存在"}`,
    ];
  }
}

module.exports = {
  getIssueDetails,
};
