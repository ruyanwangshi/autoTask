import shell from 'shelljs';
export * from './common.js';
export * from './path.js';
export declare function getFileList(): shell.ShellArray;
export declare function createBuildDir(build_map: string[]): void;
export declare function buildandMv(cmd: string, input: string, output: string): void;
