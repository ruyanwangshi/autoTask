import { resovePath } from './utils/index.js';
import fs from 'node:fs/promises';
import inquirer from 'inquirer';
import shell from 'shelljs';
import configFile from './autoTask.js';
const configFileName = 'autoTask.json';
const outputDir = 'autoTask';
const fromFile = 'dist';
async function runInquirer(scripts) {
    // const builds = scripts.filter(item => item.includes('build'))
    const builds = [];
    for (const key in scripts) {
        if (key.includes('build')) {
            builds.push({
                name: key,
                value: key,
            });
        }
    }
    console.log('打包路径为', builds);
    const had = files.includes(outputDir);
    console.log('是否存在打包后的路径', files, had);
    if (had) {
        shell.rm('-r', outputDir);
    }
    shell.mkdir(outputDir);
    const promptRes = await inquirer.prompt([
        {
            type: 'checkbox',
            name: 'build',
            choices: builds,
        },
    ]);
    const build_map = promptRes.build.map((item) => {
        if (item.includes('pre')) {
            return {
                name: 'pre',
                cmd: item,
            };
        }
        else if (item.includes('prod')) {
            return {
                name: 'prod',
                cmd: item,
            };
        }
        else {
            return {
                name: 'test',
                cmd: item,
            };
        }
    });
    // 创建打包后的文件夹
    createBuildDir(build_map);
    // 这段代码是在Windows操作系统的命令提示符中执行
    // chcp 65001
    // 用于将命令的字符集编码设置为UTF-8,以便支持Unicode字符集。
    //   shell.exec(`chcp 65001`)
    // 开始执行打包命令并移动文件夹
    buildMv(build_map);
}
function createBuildDir(build_map) {
    try {
        shell.mkdir(...build_map.map((item) => resovePath(outputDir, item.name)));
    }
    catch (e) {
        console.log('创建地址成功');
    }
}
function buildMv(build_map) {
    for (const item of build_map) {
        shell.exec(`pnpm ${item.cmd}`);
        console.log(resovePath(fromFile, './'), resovePath(item.name, './'));
        // 将 sourceDir 中的所有文件移动到 destDir
        shell.mv('-n', resovePath(fromFile, './*'), resovePath(outputDir, item.name));
        // -n选项表示不覆盖已存在的文件，如果你需要覆盖文件，可以将该选项删除。
        // shell.cp(resovePath(fromFile, './*'), resovePath(outputDir, item.name))
        // shell.mv(`${resovePath(fromFile,'./*')}/`, resovePath(outputDir, item.name))
    }
}
const cmd_map = {
    '--i': setConfigFile,
    '--b': runBuild,
    init: setConfigFile,
    build: runBuild,
};
const files = shell.ls();
function setConfigFile() {
    //   const had = files.includes(configFileName)
    const writePath = resovePath(configFileName);
    const configFileContent = JSON.stringify(configFile, null, 4);
    fs.writeFile(writePath, configFileContent).then((res) => {
        console.log('初始化配置成功', writePath);
    });
    return true;
}
async function runBuild(packagePath) {
    const res = await fs.readFile(packagePath, 'utf-8');
    const packages = JSON.parse(res);
    // 项目配置文件的运行脚本列表
    const scripts = packages.scripts;
    runInquirer(scripts);
    return true;
}
async function runCommand(avgs, packagePath) {
    console.log('对应的环境列表', avgs);
    let next = false;
    console.time('start');
    if (Array.isArray(avgs)) {
        const cmd = avgs[0];
        const fn = cmd_map[cmd];
        if (typeof fn === 'function') {
            next = await fn(packagePath);
            console.log('执行了', next);
        }
        return next;
    }
    console.timeEnd('start');
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
