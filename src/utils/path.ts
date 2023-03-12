import path from 'node:path'

export const cwd = process.cwd()

export function resovePath(...paths: string[]) {
  return path.resolve(cwd, ...paths);
}

