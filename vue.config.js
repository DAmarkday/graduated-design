module.exports = {
  publicPath: '/',
  devServer: {
      port: '8082',
      open: false,
      proxy: {
          '/api': {
              target: 'http://127.0.0.1:8080',
              changeOrigin: true,
              pathRewrite: {
                  '^/api': '/api',
              }
          }
      }
  },
    css: {
      loaderOptions: {
        sass: {
          //依次导入的公用的scss变量，公用的scss混入，共用的默认样式
          prependData: `@import "./src/assets/global.scss";`,
        },
      },
    },
  }