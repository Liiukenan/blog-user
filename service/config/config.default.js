/* eslint valid-jsdoc: "off" */

"use strict";

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1605180950794_8419";

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  config.mysql = {
    // database configuration
    client: {
      // host
      host: "localhost",
      // port
      port: "3306",
      // username
      user: "root",
      // password
      password: "aini=1314",
      // database
      database: "blogData",
    },
    // load into app, default is open
    app: true,
    // load into agent, default is close
    agent: false,
  };
  
　 config.security = {
　　　　csrf: {enable: false,ignoreJSON:true},
　　　　domainWhiteList: [ '*' ]
　　};
  // 配置文件
  config.multipart = {
    fileSize: '50mb',
    mode: 'stream', // 这里要配置成stream，详情可以参考官网。俩个模式。
  };
  config.cors = {
    origin: 'http://127.0.0.1:3001',
    credentials: true,  //允许Cookie可以跨域
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS'
  };
  config.cluster = { 
    listen:{
      path:'',
      port:7002,
      hostname:'127.0.0.1'
    }
  };

  return {
    ...config,
    ...userConfig,
  };
};
