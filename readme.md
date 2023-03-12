# autoTask自动化工具

> 编写插件的时候要注意配置项规范

### package.json配置项

```json
{
 "name": "autoTask", // 当前插件名称
 "type": "module", // 开发模式
 "version": "1.0.0",
 "main": "./lib/index.js", // 入口
 "bin": { // 插件指令入口
  "autoTask": "./bin/autoTask.js"
 }
}

```

### 脚本命令的入口必须添加此行否则客户端不认识当前的脚本执行
```js
#!/usr/bin/env node
```
