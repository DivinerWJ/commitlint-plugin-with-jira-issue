/*
 * @Author: wangjie59
 * @Date: 2021-04-28 13:10:20
 * @LastEditors: wangjie59
 * @LastEditTime: 2021-05-27 21:29:31
 * @Description: index
 * @FilePath: /weixin/Users/wangjie/Documents/study/test/commitlint-plugin-with-jira-issue/index.js
 */

const path = require("path");
const directoryPath = path.join(path.resolve(), '.demand.js');
const { JIRA_PROJECT }= require(directoryPath);
const { getIssueDetails } = require('./lib/util');

module.exports = {
  rules: {
    'with-jira-issue': async ({demand}) => {
      
      const JIRA_REG = new RegExp(`${JIRA_PROJECT}-.*\\s#comment|#ignore_scan#`);
      if (!JIRA_PROJECT) {
        return [
          false,
          `Your subject should contain JIRA issue, Make sure that the file(.demand.js) exists in the project, or JIRA_PROJECT is valid.`,
        ];
      }
      if (!JIRA_REG.test(demand)) {
        return [
          false,
          `Your commit header should contain JIRA issue, like (XXXXXXX-XXXX #comment update: something)
          error commit header: ${demand}`,
        ];
      }

      const issueDetails = await getIssueDetails(demand.split(" ")[0]);
      return issueDetails;
    }
  }
}