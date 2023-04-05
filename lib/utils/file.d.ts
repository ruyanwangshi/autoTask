import shell from 'shelljs';
/**
 * @desc 文件移动方法
 * @param source 来源文件
 * @param dest 目的地文件
 * @param dir 是否要把来源地的整个文件包括自身移动到目的地文件 默认是false 移动的是来源文件底下的所有文件到目的地
 */
export declare function mv_file(source: string, dest: string, dir?: boolean): shell.ShellString;
