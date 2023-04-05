interface CmdMap {
  name: string
  cmd: string
}

interface DefaultConfig {
  // 打包配置
  build: {
    //  打包输出文件配置
    output: {
      fileName: string
      basePath: string
    }
    //   打包输入文件配置
    fromFile: {
      fileName: string
    }
    //   对应默认执行的打包脚本
    scripts: {
      test: string
      pre: string
      prod: string
    }
  }
  //   自动化脚本配置
  config: {
    fileName: string
  }
}

interface RunOptions {
  packagePath: string
  config: DefaultConfig
}

declare module 'epub-gen'
