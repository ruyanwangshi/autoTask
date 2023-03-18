import fs from 'node:fs/promises'
import { getFileList } from '../../utils/index.js'
import type { CmdMap } from '../../types'
import { outputDir, fromFile } from '../../utils/index.js'
import inquirer from 'inquirer'
import shell from 'shelljs'
import { createBuildDir, buildandMv, resovePath } from '../../utils/index.js'

// 运行打包脚本
async function runBuild(packagePath: string) {
  const res = await fs.readFile(packagePath, 'utf-8')
  console.log('开始执行了')
  const packages = JSON.parse(res) as {
    [key: string]: any
  }
  // 项目配置文件的运行脚本列表
  const scripts = packages.scripts
  runInquirer(scripts)

  return true
}

async function runInquirer(scripts: string[]) {
  // const builds = scripts.filter(item => item.includes('build'))
  const builds: Array<{
    name: string
    value: string
  }> = []
  for (const key in scripts) {
    if (key.includes('build')) {
      builds.push({
        name: key,
        value: key,
      })
    }
  }
  console.log('打包路径为', builds)

  const had = getFileList().includes(outputDir)
  console.log('是否存在打包后的路径', getFileList(), had)

  if (had) {
    shell.rm('-r', outputDir)
  }
  shell.mkdir(outputDir)

  const promptRes = await inquirer.prompt([
    {
      type: 'checkbox', // 多选框
      name: 'build',
      choices: builds,
    },
  ])

  const build_map = create_cmd_file_map(promptRes.build)

  // 创建打包后的文件夹
  const buidFile = build_map.map((item) => resovePath(outputDir, item.name))
  console.log('打包文件结果=>', buidFile, build_map)

  // 创建build文件列表
  createBuildDirs(build_map)

  // 执行打包命令并移动打包后的文件到对应的目录
  runCmdAndBuild(build_map)

  // createBuildDir(build_map)

  // 这段代码是在Windows操作系统的命令提示符中执行
  // chcp 65001
  // 用于将命令的字符集编码设置为UTF-8,以便支持Unicode字符集。
  //   shell.exec(`chcp 65001`)
}

function createBuildDirs(build_map: CmdMap[]) {
  build_map.forEach((item) => {
    shell.mkdir(resovePath(outputDir, item.name))
  })
}

function runCmdAndBuild(build_map: CmdMap[]) {
  build_map.forEach((item) => {
    buildandMv(`npm run ${item.cmd}`, fromFile, resovePath(outputDir, item.name))
  })
}

function create_cmd_file_map(build_cmd: string[]) {
  const build_map = build_cmd.map((item) => {
    if (item.includes('pre')) {
      return {
        name: 'pre',
        cmd: item,
      }
    } else if (item.includes('prod')) {
      return {
        name: 'prod',
        cmd: item,
      }
    } else {
      return {
        name: 'test',
        cmd: item,
      }
    }
  }) as CmdMap[]
  return build_map
}

export default runBuild
