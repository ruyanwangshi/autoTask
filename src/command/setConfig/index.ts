import fs from 'node:fs/promises'
import { resovePath, getFileList } from '../../utils/index.js'
import configFile from '../../config/index.js'

function setConfigFile() {
  const configFileName = configFile.config.fileName
//   const had = getFileList().includes(configFileName)
  const writePath = resovePath(configFileName)
  const configFileContent = JSON.stringify(configFile, null, 4)
  fs.writeFile(writePath, configFileContent).then((res) => {
    console.log('初始化配置成功', writePath)
  })
  return true
}

export default setConfigFile
