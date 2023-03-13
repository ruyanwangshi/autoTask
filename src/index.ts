import { resovePath, cwd } from './utils/index.js'
import fs from 'node:fs/promises'
import inquirer from 'inquirer'
import shell from 'shelljs'
import { choices } from './config/index.js'
import configFile from './autoTask.js'

const configFileName = 'autoTask.json'
const outputDir = 'autoTask'
const fromFile = 'dist'

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

  const had = files.includes(outputDir)
  console.log('是否存在打包后的路径', files, had)
  
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

  const build_map = promptRes.build.map((item) => {
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
    } else if (item.includes('test')) {
      return {
        name: 'test',
        cmd: item,
      }
    }
  })

  try {
    shell.mkdir(...build_map.map((item) => resovePath(outputDir, item.name)))
  } catch (e) {
    console.log('创建地址成功')
  }
  shell.exec(`chcp 65001`)
  for (const item of build_map) {
    shell.exec(`pnpm ${item.cmd}`)
    console.log(resovePath(fromFile, './'), resovePath(item.name, './'))
    shell.cp(resovePath(fromFile, './*'), resovePath(outputDir, item.name))
    shell.mv(`${resovePath(fromFile,'./*')}/`, resovePath(outputDir, item.name))
  }
}

const cmd_map = {
  '--i': setConfigFile,
  '--b': runBuild,
  init: setConfigFile,
  build: runBuild,
} as {
  [key: string]: any
}

const files = shell.ls()

function setConfigFile() {
  //   const had = files.includes(configFileName)
  const writePath = resovePath(configFileName)
  const configFileContent = JSON.stringify(configFile, null, 4)
  fs.writeFile(writePath, configFileContent).then((res) => {
    console.log('初始化配置成功', writePath)
  })
  return true
}

async function runBuild(packagePath: string) {
  const res = await fs.readFile(packagePath, 'utf-8')
  const packages = JSON.parse(res) as {
    [key: string]: any
  }
  // 项目配置文件的运行脚本列表
  const scripts = packages.scripts
  runInquirer(scripts)

  return true
}

async function runCommand(avgs: string[], packagePath: string) {
  let next = false
  console.time('start')
  if (Array.isArray(avgs)) {
    const cmd = avgs[0]
    const fn = cmd_map[cmd]
    if (typeof fn === 'function') {
      next = await fn(packagePath)
      console.log('执行了', next)
    }
    return next
  }
  console.timeEnd('start')
  return next
}

async function run(avgs: string[], packagePath: string) {
  console.log(avgs, packagePath)
  if (await runCommand(avgs, packagePath)) return

  try {
    // 检查是否有自动化打包用具文件
  } catch (error) {
    console.log('请确认该项目配置文件正确！', error)
  }
}

export default run
