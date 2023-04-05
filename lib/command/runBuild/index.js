import fs from 'node:fs/promises';
import { getFileList } from '../../utils/index.js';
import inquirer from 'inquirer';
import shell from 'shelljs';
import { buildandMv, resovePath } from '../../utils/index.js';
let build_config = {};
// 运行打包脚本
async function run(options) {
    const { packagePath, config } = options;
    build_config = config.build;
    const res = await fs.readFile(packagePath, 'utf-8');
    console.log('开始执行了');
    const packages = JSON.parse(res);
    // 项目配置文件的运行脚本列表
    const scripts = packages.scripts;
    runInquirer(scripts).catch(() => {
        console.log('程序终止');
    });
    return true;
}
async function runInquirer(scripts) {
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
    try {
        const promptRes = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'build',
                choices: builds,
            },
        ]);
        const outputDir = build_config.output.fileName;
        const fromFile = build_config.fromFile.fileName;
        const had = getFileList().includes(outputDir);
        if (had) {
            shell.rm('-r', outputDir);
        }
        shell.mkdir(outputDir);
        const build_map = create_cmd_file_map(promptRes.build);
        // 创建打包后的文件夹
        const buidFile = build_map.map((item) => resovePath(outputDir, item.name));
        console.log('打包文件结果=>', buidFile, build_map);
        // 创建build文件列表
        createBuildDirs(build_map, outputDir);
        // 执行打包命令并移动打包后的文件到对应的目录
        runCmdAndBuild(build_map, outputDir, fromFile);
        // createBuildDir(build_map)
        // 这段代码是在Windows操作系统的命令提示符中执行
        // chcp 65001
        // 用于将命令的字符集编码设置为UTF-8,以便支持Unicode字符集。
        //   shell.exec(`chcp 65001`)
        console.log('最终结果', promptRes);
    }
    catch (e) {
        console.log('终止了', e);
    }
}
function createBuildDirs(build_map, outputDir) {
    build_map.forEach((item) => {
        shell.mkdir(resovePath(outputDir, item.name));
    });
}
function runCmdAndBuild(build_map, outputDir, fromFile) {
    build_map.forEach((item) => {
        buildandMv(`npm run ${item.cmd}`, fromFile, resovePath(outputDir, item.name));
    });
}
function create_cmd_file_map(build_cmd) {
    let ENVTYPE;
    (function (ENVTYPE) {
        ENVTYPE["PRE"] = "pre";
        ENVTYPE["PROD"] = "prod";
        ENVTYPE["TEST"] = "test";
        ENVTYPE["DEFAULT"] = "task";
    })(ENVTYPE || (ENVTYPE = {}));
    function create_cmd_map(env, cmd) {
        return {
            name: env,
            cmd,
        };
    }
    const build_map = build_cmd.map((item) => {
        const [_, mode] = item.split(':');
        switch (mode) {
            case ENVTYPE.PRE:
                return create_cmd_map(ENVTYPE.PRE, item);
            case ENVTYPE.PROD:
                return create_cmd_map(ENVTYPE.PROD, item);
            case ENVTYPE.TEST:
                return create_cmd_map(ENVTYPE.TEST, item);
            default:
                return create_cmd_map(`${ENVTYPE.DEFAULT}_${item}`, item);
        }
    });
    return build_map;
}
export default run;
