import { runBuild, setConfig, pdfepub } from './command/index.js';
const cmd_map = {
    '--i': setConfig,
    '--p': pdfepub,
    '--b': runBuild,
    init: setConfig,
    build: runBuild,
};
// 开始跑用户输入的命令
async function runCommand(avgs, packagePath) {
    if (!avgs.length) {
        console.log('请输入对应的命令 ->>\n');
        console.log('--i ->> 初始化命令行工具配置 \n');
        console.log('--b ->> 从当前用户的package配置中读取对应的打包配置 \n');
        return;
    }
    let next = false;
    if (Array.isArray(avgs)) {
        const cmd = avgs[0];
        const fn = cmd_map[cmd];
        console.log('对应的要执行的命令为', fn);
        try {
            next = await fn(packagePath);
            console.log('执行了', next);
        }
        catch (error) {
            console.log('执行脚本出错', error);
        }
        return next;
    }
    return next;
}
async function run(avgs, packagePath) {
    console.log(avgs, packagePath);
    if (await runCommand(avgs, packagePath))
        return;
    try {
        // 检查是否有自动化打包用具文件
    }
    catch (error) {
        console.log('请确认该项目配置文件正确！', error);
    }
}
export default run;
