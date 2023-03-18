import shell from 'shelljs'
import { resovePath } from './path.js'

/**
 * @desc 文件移动方法
 * @param source 来源文件
 * @param dest 目的地文件
 * @param dir 是否要把来源地的整个文件包括自身移动到目的地文件 默认是false 移动的是来源文件底下的所有文件到目的地
 */
export function mv_file(source: string, dest: string, dir = false) {
  // 将 sourceDir 中的所有文件移动到 destDir
  const res = shell.mv('-n', resovePath(source, dir ? '' : './*'), dest)
  // -n选项表示不覆盖已存在的文件，如果你需要覆盖文件，可以将该选项删除。
  return res
}

// // 创建文件夹
// export function mkdir(dir:string[]) {
//    const res =  shell.mkdir(dir);
//    return res
// }

// // 执行命令行命令
// export function exec(cmd: string) {
//     const res = shell.exec(cmd);
//     return res
// }
