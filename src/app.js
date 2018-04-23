// 静态资源管理器
const http = require('http');
const config = require('./config/config');
const chalk = require('chalk');
const router = require('./helper/router');

// const promisify = require('promisify');
const server = http.createServer((req, res) => {
  router(req, res);

});

server.listen(config.port,config.hostname,()=>{
  console.info(`Server started at ${chalk.green(`${config.hostname}:${config.port}`)}`);
});


