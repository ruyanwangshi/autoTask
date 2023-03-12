// 问题类型input 为用户的输入的类型

// 单选类型配置
export const choices = {
  //   type: 'list', // 单选列表
  //   type: 'rawlist', // 单选列表可以用户自己输入选择列表的下标列表
  //   type: 'confirm', // 时候继续 true 和 false
  //   type: 'expand',
  type: 'checkbox', // 多选框
  name: '是否打包',
  choices: [
    {
      name: '测试1',
      value: '1',
    },
    {
      name: '测试2',
      value: '2',
    },
  ],
}
