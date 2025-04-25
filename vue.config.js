const path = require('path')
function resolve (dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    lintOnSave:false,
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@$', resolve('src'))
            .set('assets',resolve('src/assets'))
            .set('components',resolve('src/components'))
            .set('libs',resolve('src/libs'))
    },
    devServer: {
      port: 8080,
      proxy: {
        "/api/": {
          target: 'http://zhike.api.test/',
          pathRewrite: { "^/api/": "" },
          secure: false,
          changeOrigin: true
        }
      }
    }
}
