// 此处安装版本为 1.8.0
const puppeteer = require("puppeteer");
const child_process = require("child_process");

type ConfigType = {
  account: string;
  password: string;
  url: string;
};
type CommandsType = string[] | string;
async function giteeUpdate(config: ConfigType) {
  const browser = await puppeteer.launch({
    // 此处可以使用 false 有头模式进行调试, 调试完注释即可
    // 注释之后不会看到弹窗，打开之后可以看到浏览器弹窗，通过 XPath 去选择对应节点
    // headless: false
  });
  const page = await browser.newPage();
  await page.goto("https://gitee.com/login");
  // 1. 选中账号控件
  const accountElements = await page.$x('//*[@id="user_login"]'); // 此处使用 xpath 寻找控件，下同
  // 2. 填入账号
  await accountElements[0].type(config.account);
  // 3. 选中密码控件
  const pwdElements = await page.$x('//*[@id="user_password"]');
  // 4. 填入密码
  await pwdElements[0].type(config.password);
  // 5. 点击登录

  const loginButtons = await page.$x(
    '//input[@type="submit" and @value="登 录"]'
  );
  await loginButtons[0].click();
  // 6. 等待登录成功
  await page.waitFor(1000);
  await page.goto(config.url); // 比如： https://gitee.com/thinkerwing/webpack/pages
  // 7.1. 监听步骤 7 中触发的确认弹框，并点击确认
  await page.on("dialog", async (dialog: { accept: () => void }) => {
    console.log("确认更新");
    dialog.accept();
  });
  // 7. 点击更新按钮，并弹出确认弹窗
  const updateButtons = await page.$x(
    '//div[@class="button orange redeploy-button ui update_deploy" and contains(text(), "更新")]'
  );

  await updateButtons[0].click();
  // 8. 轮询并确认是否更新完毕
  while (true) {
    await page.waitFor(2000);
    try {
      // 8.1 获取更新状态标签
      const deploying = await page.$x('//*[@id="pages_deploying"]');
      if (deploying.length > 0) {
        console.log("更新中...");
      } else {
        console.log("更新完毕", getTimestamp());
        break;
      }
    } catch (error) {
      break;
    }
  }
  await page.waitFor(500);
  //   10.更新完毕，关闭浏览器
  browser.close();
}

function execCommand(commands: CommandsType) {
  (Array.isArray(commands) ? commands : [commands]).forEach((c) => {
    try {
      console.log(`start: ${c}...`);
      console.log(child_process.execSync(c).toString("utf8"));
    } catch (error: any) {
      console.log("\x1B[31m%s\x1B[0m", error.stdout.toString());
      process.exit(1);
    }
  });
}

const getTimestamp = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

async function updateTools({
  commands,
  config
}: {
  commands: CommandsType;
  config: ConfigType;
}) {
  execCommand(commands);
  await giteeUpdate(config);
}

module.exports = updateTools;
