const promisify = require('util').promisify;
const path = require('path');
const config = require('../config/config');
const fs = require('fs');
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const getMimeSet = require('./mimeType');

const artTemplate = require('art-template');
// 读入模版文件
const showdirHtmlPath = path.join(
  __dirname,
  '../template/showdir/showdir.html'
);
let showdirStylePath = path.join(__dirname, '../template/showdir/showdir.css');
showdirStylePath = path.relative(config.root, showdirStylePath);
const baseImgUrl = path.join(__dirname, '../img');
// 这里使用了同步的读取，因为这个模版不大，而且只需要读取一次，再者只有读取了模版接下来才能渲染页面，因此没必要使用异步
const showdirHtml = fs.readFileSync(showdirHtmlPath, 'utf-8');
const showdirTlp = artTemplate.compile(showdirHtml);

module.exports = router;
async function router(req, res) {
  // 根据url的路径判断当前文件是文件还是文件夹，从而执行不同的操作
  const url = req.url;
  const filePath = path.join(config.root, url);
  // 判断文件是文件还是文件夹
  try {
    const stats = await stat(filePath);
    if (stats.isFile()) {
      // 如果是文件读取文件内容显示在页面上
      const mimeTypeSet = getMimeSet(filePath);
      res.setHeader('Content-Type', `${mimeTypeSet};charset=utf-8`);
      res.statusCode = 200;
      fs.createReadStream(filePath).pipe(res);
    } else if (stats.isDirectory()) {
      // 如果是文件夹，显示该文件夹内的文件在页面上
      res.setHeader('Content-Type', 'text/html;charset=utf-8');
      res.statusCode = 200;
      const fileNames = await readdir(filePath);
      // 利用得到的文件名渲染页面
      const data = getPageData(filePath,fileNames);
      res.write(showdirTlp(data));
      res.end();
    }
  } catch (err) {
    res.setHeader('Content-Type', 'text/plain;charset=utf-8');
    res.statusCode = 404;
    res.write('Sorry,no such file or directory.');
    res.end();
    return;
  }
}
function getPageData(filePath,fileNames) {
  const files = getfilesInfo(filePath,fileNames);

  const data = {
    styleUrl: '/' + showdirStylePath,
    title: path.basename(filePath),
    dir: path.relative(config.root, filePath)
      ? '/' + path.relative(config.root, filePath)
      : '',
    files
  };
  return data;
}
function getfilesInfo(filePath,fileNames) {
  let files = [];
  let imgUrl = null;
  fileNames.forEach(fileName => {
    let obj = {};
    obj.name = fileName;
    // 判断这些文件是否是文件夹，如果是文件夹就不用判断mime
    const currentFilePath = path.join(filePath,fileName);
    const stats = fs.statSync(currentFilePath);
    if(stats.isFile()){
      const mimeType = fileName.split('.').pop();
      if(getMimeSet(fileName).indexOf('image/')!==-1){
        imgUrl = path.join(baseImgUrl, fileName);
      } else if (config.imgList.indexOf(mimeType + '.jpg') !== -1) {
        imgUrl = path.join(baseImgUrl, mimeType + '.jpg');
      } else {
        imgUrl = path.join(baseImgUrl, 'unknow.jpg');
      }
    } else if(stats.isDirectory()){
      imgUrl = path.join(baseImgUrl, 'folder.jpg');
    }

    obj.imgUrl = '/' + path.relative(config.root, imgUrl);
    files.push(obj);
  });
  return files;
}


