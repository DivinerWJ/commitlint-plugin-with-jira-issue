/*
 * @Author: wangjie59
 * @Date: 2021-05-27 19:10:30
 * @LastEditors: wangjie59
 * @LastEditTime: 2022-04-12 16:16:34
 * @Description:
 * @FilePath: /commitlint-plugin-with-jira-issue/lib/util.js
 */

const {
  domain,
  apiVersion,
  issueId,
  storyId,
  assignee,
  developers,
  devfield,
  dueDate,
  indeterminate,
  dueDatelimit,
  checkPFDate,
  checkPFDatefield,
  token,
} = require("./load");
const {
  getIssue,
} = require("../api/issues");

/**
 * @description: 获取日期差
 * @param {Date} targetDate 目标日期
 * @return {Float} 日期差
 */
function getDiffDate(targetDate) {
  let r = new Date(targetDate.replace(/-/g, "/"));
  let n = new Date((new Date()).toLocaleDateString());
  const diff = r.getTime() - n.getTime();
  const d = diff / (24 * 60 * 60 * 1000);
  return d;
}

const needJudgeIssue = () => {
  if (!(domain && apiVersion && issueId && issueId.length && token && isValidToken())) {
    console.log("\x1b[32m%s\x1b[0m", "请授予登录jira以及查询issue的权限，从而更精准校验issue");
    console.log("\x1b[33m%s\x1b[0m", {
      domain,
      apiVersion,
      issueId,
      token,
      isValidToken: !!isValidToken(),
    });
    return false;
  }
  return true;
};

const getIssueDetails = async demand => {
  try {
    const res = await getIssue(demand);
    if (!res || !res.fields || !res.fields.issuetype || !issueId.includes(res.fields.issuetype.id)) {
      // 这不是一个有效的故事
      return [
        false,
        `这不是一个有效的issue:
        issueType: ${res.fields.issuetype.name} id: ${res.fields.issuetype.id}

        check: ${domain}/browse/${demand}`,
      ];
    }
    const fields = res.fields;
    const statusCategory = (fields.status && fields.status.statusCategory) || {};
    // 是否校验开发人员
    let haveDev = false;
    if (developers && devfield) {
      haveDev = fields[devfield] && fields[devfield].some(i => i.name && i.name.toUpperCase()=== isValidToken());
      if (!haveDev) {
        // 开发人员不对
        return [
          false,
          `开发人员不是你，最好检查一下
          devs: ${(fields[devfield] && fields[devfield].length && fields[devfield].map(i => i.name)) || "none"}`,
        ];
      }
    }
    // 是否校验经办人
    if (assignee) {
      if (!fields.assignee || (fields.assignee.name && fields.assignee.name.toUpperCase() !== isValidToken())) {
        // 经办人不对
        return [
          false,
          `经办人不是你，最好检查一下
          assignee: ${(fields.assignee && fields.assignee.name) || "none"}`,
        ];
      }
    }
    // 是否校验到期日
    if (dueDate) {
      if (!fields.duedate || ((statusCategory.id === indeterminate) && getDiffDate(fields.duedate) < dueDatelimit)) {
        // 即将到期，注意一下
        return [
          false,
          "故事进行中，但到期日不对或者即将到期或者已经超期，注意一下",
        ];
      }
    }
    // 是否校验计划开发完全日期
    if (fields.issuetype.id === storyId && checkPFDate) {
      console.log('statusCategory.id: ', statusCategory.id);
      if (!fields[checkPFDatefield] || statusCategory.id === indeterminate) {
        // 即将到期，注意一下
        return [
          false,
          "故事未完成，但计划开发完成日期为空",
        ];
      }
    }
    if (statusCategory.id !== indeterminate) {
      console.log("\x1b[33m%s\x1b[0m", "这个故事不是进行中的，注意一下");
    }
    console.table({
      "issue 类型": fields.issuetype.name,
      "issue 类型id": fields.issuetype.id,
      "issue 链接:": `${domain}/browse/${demand}`,
      "issue 状态:": (fields.status && fields.status.name) || "don't know",
      "issue 状态分类:": statusCategory.name || "don't know",
      "经办人": (fields.assignee && fields.assignee.name) || "none",
      "是否为开发人员:": !!developers && haveDev,
      "到期日:": fields.duedate || "Invalid Date",
    });
    return [
      true,
    ];
  } catch (error) {
    const message = JSON.parse(error.message);
    
    return [
      false,
      `这不是一个有效的问题
      httpStatus: status: ${message.status}; statusText: ${message.statusText};
      view: ${message.loginReason ? "登录失败，需要验证码登录，请手动在网页尝试登录，登陆成功重新尝试提交，Login：" + message.please_login : (message && message.data && message.data.errorMessages) || "查询问题不存在"};
      `,
    ];
  }
};

const isValidToken = () => {
  try {
    const base64Decode = Buffer.from(token, "base64").toString("utf-8");
    if (token === Buffer.from(base64Decode, "utf-8").toString("base64")) {
      return base64Decode.split(":")[0].toUpperCase();
    }
  } catch (error) {
    console.log("\x1b[33m%s\x1b[0m", error);
  }
  return false;
};

module.exports = {
  getIssueDetails,
  needJudgeIssue,
  isValidToken,
};
