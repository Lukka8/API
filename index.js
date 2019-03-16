const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const Statsjs = require("./Modules/Stats.js");


const port = process.argv[2] || 9000;

const mimeType = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.eot': 'appliaction/vnd.ms-fontobject',
  '.ttf': 'aplication/font-sfnt'
};

http.createServer(function (req, res) {
  if (req.method == "POST") {
    //95206881
    if (!JSON.stringify(req.rawHeaders).includes(2954706683)) {
      return;
    }

    var body = '';

    req.on('data', function (data) {
        body += data;
    });
    
    req.on('end', function () {
      if (req.url == "/Website/API/Data.json") {
        Statsjs.run(body);
        return;
      }
    });
  }

  const parsedUrl = url.parse(req.url);
  const sanitizePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');
  let pathname = path.join(__dirname, sanitizePath);

  fs.exists(pathname, function (exist) {
    if(!exist) {
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
      return;
    }
    if (fs.statSync(pathname).isDirectory()) {
      pathname += '/index.html';
    }
    fs.readFile(pathname, function(err, data){
      if(err){
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        const ext = path.parse(pathname).ext;
        res.setHeader('Content-type', mimeType[ext] || 'text/plain' );
        res.end(data);
      }
    });
  });


}).listen(parseInt(port));

console.log(`Server listening on port ${port}`);