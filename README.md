<!--
 * @Author: DivinerWJ
 * @Date: 2021-04-28 13:08:09
 * @LastEditors: DivinerWJ
 * @LastEditTime: 2024-02-06 09:41:57
 * @Description: readme
 * @FilePath: /commitlint-plugin-with-jira-issue/README.md
-->

# commitlint-plugin-with-jira-issue

校验commit message是否合规，依赖于commitlint-with-demand

# Configuration

`commitlint-plugin-with-jira-issue` picks up configuration from ./.demand.js

- **JIRA_PROJECT**: { string | array, default [] }: This is the subject. Example: `XX10001`
- **domain**: { string, default "" }: This is the subject domain. Example: `http://jira.domain.com`
- **issueId**: { Array, default ["10001"] }: The type of issues that needs to be verified. Example: `10001`
- **storyId**: { string, default "10001" }: The id of stories
- **token**: { string, default "" }: This is the subject. Example: ``window.btoa(`${user}:${token}`)``. [Basic authentication](https://developer.atlassian.com/server/jira/platform/basic-authentication/)
  1. Build a string of the form username:password.
  2. Encode the string to Base64.
  3. Supply an authorization header with format Authorization: Basic {encoded-string}. Make sure to replace {encoded-string} with your encoded string from Step 2.
For example, if your username and password are both fred then the string "fred:fred" encodes to ZnJlZDpmcmVk in Base64.

- **apiVersion**: { string, default "/rest/api/2" }: Version of the API.
- **assignee**: { boolean, default true }: Whether to verify the assignee.
- **developers**: { boolean, default true }: Whether to verify the developers.
- **devfield**: { string, default "customfield_11637" }: The field of developers.
- **dueDate**: { boolean, default true }: Whether to verify the dueDate.
- **checkPFDate**: { boolean, default true }: Whether to verify the PF.
- **checkPFDatefield**: { string, default "customfield_13632" }: The field of PF.
- **dueDatelimit**: { number, default 0 }: Custom expiration range (day).

```JavaScript
// .demand.js
module.exports = {
  JIRA_PROJECT: ["XX10001"], // Your JIRA project name
  domain: "http://jira.domain.com", // domain
  issueId: ["10001"], // 需要校验的issue类型
  storyId: "10001", // 故事的id 默认 10001
  token: "dXNlcjp0b2tlbg==", // base64处理之后得到的token
  apiVersion: "/rest/api/2", // 自定义接口版本 默认是 v2 不建议改动
  assignee: false, // 是否校验经办人 默认是 true
  developers: false, // 是否校验开发人员 默认是 true
  devfield: "", // 自定义开发人员字段，默认是 customfield_11637
  dueDate: false, // 是否校验到期日 默认是 true
  dueDatelimit: 1, // 自定义到期范围提醒 默认是 0
  checkPFDate: false, // 是否校验计划开发完成日期 默认是 true 仅当 issue 的类型为 storyId 时才会校验
  checkPFDatefield: "", // 自定义计划开发完成字段，默认是 customfield_13632
}
```

- 获取 token：在浏览器中运行：window.btoa(`${user}:${token}`) 即可 user：账号 如 abc11；token：密码 如 1234 window.btoa("abc11:1234")
