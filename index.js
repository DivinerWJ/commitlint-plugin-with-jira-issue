/*
 * @Author: DivinerWJ
 * @Date: 2021-04-28 13:10:20
 * @LastEditors: DivinerWJ
 * @LastEditTime: 2024-02-06 09:42:49
 * @Description: index
 * @FilePath: /commitlint-plugin-with-jira-issue/index.js
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

      const JIRA_REG = JIRA_PROJECT.map(j => new RegExp(`${j}-.*\\x20#comment|#ignore_scan#`));
      if (!JIRA_PROJECT) {
        return [
          false,
          "Your subject should contain JIRA issue, Make sure that the file(.demand.js) exists in the project, or JIRA_PROJECT is valid.",
        ];
      }
      if (!JIRA_REG.some(reg => reg.test(demand))) {
        return [
          JIRA_REG.some(reg => reg.test(demand)),
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
