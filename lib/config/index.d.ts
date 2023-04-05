declare const _default: {
    build: {
        output: {
            fileName: string;
            basePath: string;
        };
        fromFile: {
            fileName: string;
        };
        scripts: {
            test: string;
            pre: string;
            prod: string;
        };
    };
    config: {
        fileName: string;
    };
    runGit: {
        branch: string[];
        version: string;
    };
};
export default _default;
export declare const choices: {
    type: string;
    name: string;
    choices: {
        name: string;
        value: string;
    }[];
};
