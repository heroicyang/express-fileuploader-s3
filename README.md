express-fileuploader-s3
===================

[![Dependency Status](https://gemnasium.com/heroicyang/express-fileuploader-s3.png)](https://gemnasium.com/heroicyang/express-fileuploader-s3)

`S3Strategy` for [express-fileuploader](https://github.com/heroicyang/express-fileuploader), use this strategy to upload files to [Amazon S3](http://aws.amazon.com/s3/).

## Install

```bash
npm install express-fileuploader-s3 --save
```

## Usage

```javascript
var http = require('http');
var express = require('express');
var mutilpart = require('connect-multiparty');
var uploader = require('express-fileuploader');
var S3Strategy = require('express-fileuploader-s3');

var app = express();
app.use('/upload/image', mutilpart());

uploader.use(new uploader.S3Strategy({
  uploadPath: '/uploads',
  headers: {
    'x-amz-acl': 'public-read'
  },
  options: {
    key: 'your api key',
    secret: 'your api secret',
    bucket: 'your bucket name'
  }
}));

app.post('/upload/image', function(req, res, next) {
  uploader.upload('s3', req.files['images'], function(err, files) {
    if (err) {
      return next(err);
    }
    res.send(JSON.stringify(files));
  });
});

http.createServer(app).listen(8000);
```

## Options

- **uploadPath**    file destination path
- **headers**       http headers. (Optional)
  For more information, [see here](https://github.com/LearnBoost/knox#put)
- **options**       s3 client options
  - **key**         api key
  - **secret**      secret
  - **bucket**      bucket name
  - **domain**      your own domain map to the bucket. (Optional)

## Running Tests

To run the test suite you must first have an S3 account, and modify the `test/config.json`.

Then execute the test suite:

```bash
make test
```

##License

The MIT License (MIT)

Copyright (c) 2013 Heroic Yang

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
