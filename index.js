/*
 * @Author: wangjie59
 * @Date: 2021-04-28 13:10:20
 * @LastEditors: wangjie59
 * @LastEditTime: 2021-05-28 12:59:30
 * @Description: index
 * @FilePath: /weixin/Users/wangjie/Documents/study/github/notes/src/项目工程化/commitlint-plugin-with-jira-issue/index.js
 */

const {
  JIRA_PROJECT,
} = require("./lib/load");
const {
  getIssueDetails,
  needJudgeIssue,
} = require("./lib/util");

module.exports = {
  rules: {
    "with-jira-issue": async ({
      demand,
    }) => {

      const JIRA_REG = new RegExp(`${JIRA_PROJECT}-.*\\s#comment|#ignore_scan#`);
      if (!JIRA_PROJECT) {
        return [
          false,
          "Your subject should contain JIRA issue, Make sure that the file(.demand.js) exists in the project, or JIRA_PROJECT is valid.",
        ];
      }
      if (!JIRA_REG.test(demand)) {
        return [
          JIRA_REG.test(demand),
          `Your commit header should contain JIRA issue, like (XXXXXXX-XXXX #comment update: something)
          error commit header: ${demand}`,
        ];
      }

      if (!needJudgeIssue()) {
        return [
          true,
        ];
      }

      const issueDetails = await getIssueDetails(demand.split(" ")[0]);
      return issueDetails;
    },
  },
};
