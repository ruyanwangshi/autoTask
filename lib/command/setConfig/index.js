import fs from 'node:fs/promises';
import { resovePath } from '../../utils/index.js';
import { configFileName, } from '../../utils/index.js';
import configFile from './config.js';
function setConfigFile() {
    //   const had = files.includes(configFileName)
    const writePath = resovePath(configFileName);
    const configFileContent = JSON.stringify(configFile, null, 4);
    fs.writeFile(writePath, configFileContent).then((res) => {
        console.log('初始化配置成功', writePath);
    });
    return true;
}
export default setConfigFile;
