const path = require('path');

module.exports = {
  // webpack 配置
  webpack: {
    // 配置别名
    alias: {
      // 约定：使用 @ 表示 src 文件所在路径
      '@': path.resolve(__dirname, 'src')
    }
  },
  devServer: {
    // 配置代理解决跨域
    proxy: {
      '/api': {
        target: 'http://139.155.96.38:8080', // https://xxx.com
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      },
      '/shit': {
        target: 'http://139.155.96.38:5000', // https://xxx.com
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/shit': '/'
        }
      }
    }
  }
};
