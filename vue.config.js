module.exports = {
    devServer: {
      proxy: {
        '/api': {
          target: 'http://localhost:1234/api', // 对应自己的接口
          changeOrigin: true,
          ws: false,
          pathRewrite: {
            '^/api': '/api',
          },
        },
      },
    },
  };