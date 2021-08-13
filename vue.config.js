module.exports = {
    devServer: {
      proxy: {
        '/Ali': {
          target: 'http://localhost:1234/Ali', // 对应自己的接口
          changeOrigin: true,
          ws: false,
          pathRewrite: {
            '^/Ali': '/Ali',
          },
        },
        '/HuaWei':{
          target: 'http://localhost:1234/HuaWei', // 对应自己的接口
          changeOrigin: true,
          ws: false,
          pathRewrite: {
            '^/HuaWei': '/HuaWei',
          },
        }
      },
    },
  };