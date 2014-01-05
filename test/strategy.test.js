/**
 * express-fileuploader-s3/test/strategy.test.js
 * @author HeroicYang <me@heroicyang.com>
 */

 /**
  * Module dependencies
  */
var fs = require('fs');
var should = require('should');
var express = require('express');
var mutilpart = require('connect-multiparty');
var request = require('supertest');
var uploader = require('express-fileuploader');
var S3Strategy = require('../lib/strategy');
var config = require('./config.json');

describe('strategy.test.js', function() {
  it('S3Strategy#uploadPath is required', function() {
    try {
      var strategy = new S3Strategy({
        options: {
          key: 'api key',
          secret: 'secret',
          bucket: 'bucket name'
        }
      });
    } catch (e) {
      should.exist(e);
    }
  });

  it('S3Strategy#options is required', function() {
    try {
      var strategy = new S3Strategy({
        uploadPath: '/uploads'
      });
    } catch (e) {
      should.exist(e);
    }
  });

  it('upload file', function(done) {
    var app = express();
    app.use('/upload/image', mutilpart());

    uploader.use(new S3Strategy({
      uploadPath: 'test-s3-strategy/uploads',
      headers: {
        'x-amz-acl': 'public-read'
      },
      options: config
    }));

    app.post('/upload/image', function(req, res) {
      uploader.upload('s3', req.files.avatar, function(err, files) {
        if (err) {
          return res.send({
            error: err
          });
        }
        res.send(files);
      });
    });

    request(app)
      .post('/upload/image')
      .attach('avatar', 'test/fixtures/heroic.jpg')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        should.exist(res.body);
        done();
      });
  });

  it('delete temp files after uploaded', function(done) {
    var app = express();
    app.use('/upload/image', mutilpart());

    uploader.use(new S3Strategy({
      uploadPath: 'test-s3-strategy/uploads',
      headers: {
        'x-amz-acl': 'public-read'
      },
      options: config
    }));

    app.post('/upload/image', function(req, res) {
      uploader.upload('s3', req.files.avatar, function(err, files) {
        if (err) {
          return res.send({
            error: err
          });
        }
        res.send(files);
      });
    });

    request(app)
      .post('/upload/image')
      .attach('avatar', 'test/fixtures/heroic.jpg')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        should.exist(res.body);
        fs.exists(res.body[0].path, function(exists) {
          exists.should.not.be.ok;
          done();
        });
      });
  });
});