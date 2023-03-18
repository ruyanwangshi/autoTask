import * as path from 'node:path'
import shell from 'shelljs'
export * from './common.js'
export * from './path.js'
import { mv_file } from './file.js'


// 获取当前路径的
export function getFileList() {
    return shell.ls()
}

export function createBuildDir(build_map: string[]) {
  try {
    shell.mkdir(build_map)
  } catch (e) {
    errorFn(e)
  }
}


// 执行打包命令，并移动打包后文件夹的内容
export function buildandMv(cmd: string, input: string, output: string) {
    try {
        shell.exec(`pnpm ${cmd}`)
        mv_file(input, output)
    } catch (error) {
        errorFn(error)
    }
}

function errorFn(error: any) {
    console.log('执行报错内容', error)
}
