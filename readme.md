
# Gitee Pages 更新插件

[npm](https://www.npmjs.com/package/pages-update)

[github](https://github.com/ThinkerWing/pages-update)
# 介绍
Gitee pages 的自动更新不是免费的，我通过使用 puppeteer库，XPath 去选择对应节点来输入账号密码和点击事件更新，这个过程只是脚本在执行，不影响用户去做其他事情。同理后续使用这个库可以造一些其他工具。🔧

# 使用
```
const updateTools = require("pages-update");
const config = require("../config");

const commands = [
  "npm run build", // 打包静态文件
  "git add ./dist -f", // 暂存dist目录
  `git commit -m 'deploy'`, // git commit
  `git push -f git@gitee.com:thinkerwing/manual.git master:pages`,
//   "git fetch origin",
//   "git reset --hard origin/master" // 会将本地分支重置到与远程分支完全一致的状态
];

updateTools({ commands, config });


const config = {
  account: "", // gitee 账号
  password: "", // gitee 密码
  url: "https://gitee.com/thinkerwing/webpack/pages" // gitpages 地址
};
updateTools({ commands, config });
```
