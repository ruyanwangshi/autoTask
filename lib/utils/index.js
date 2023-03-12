import * as path from 'node:path';
const cwd = process.cwd();
export function resovePath(...paths) {
    console.log('当前运行的路径为', cwd);
    return path.resolve(cwd, ...paths);
}
