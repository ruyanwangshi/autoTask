export default {
  build: {
    output: './autoTask',
    scripts: {
        test: 'npm run build:test',
        pre: 'npm run build:pre',
        prod: 'npm run build:prod'
    }
  },
}
