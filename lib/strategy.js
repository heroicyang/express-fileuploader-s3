/**
 * express-fileuploader-s3/lib/strategy.js
 * Upload files to Amazon S3: http://aws.amazon.com/s3/
 * @author HeroicYang <me@heroicyang.com>
 */

/**
 * Module dependencies
 */
var path = require('path');
var Strategy = require('express-fileuploader').Strategy;
var knox = require('knox');

/**
 * S3Strategy for express-fileuploader
 *
 * Examples:
 *
 *    var uploader = require('express-fileuploader');
 *    var S3Strategy = require('express-fileuploader-s3');
 *    
 *    uploader.use(new S3Strategy({
 *      uploadPath: '/uploads',
 *      headers: {
 *        'x-amz-acl': 'public-read'
 *      },
 *      options: {
 *        key: 'your api key',
 *        secret: 'your secret',
 *        bucket: 'your bucket name',
 *        domain: 'http://s3.amazonaws.com/{bucket}'
 *      }
 *    }));
 *
 * @param {Object}  options
 *  - uploadPath  required
 *  - headers     optional    default: {}
 *  - options     required
 *    - key     required
 *    - secret  required
 *    - bucket  required
 *    - domain  optional     default: 'http://s3.amazonaws.com/{bucket}'
 * 
 * @return {Strategy}
 */
module.exports = exports = Strategy.extend({
  name: 's3',
  constructor: function(options) {
    options = options || {};
    this.uploadPath = options.uploadPath;
    this.headers = options.headers || {};
    this.options = options.options;

    if (!this.uploadPath) {
      throw new Error('S3Strategy#uploadPath required.');
    }
    if (!this.options) {
      throw new Error('S3Strategy#options required.');
    }
    if (!this.options.key || !this.options.secret || !this.options.bucket) {
      throw new Error('S3Strategy#options require key, secret, bucket.');
    }

    if (!this.options.domain) {
      this.options.domain = 'http://s3.amazonaws.com/' + this.options.bucket;
    }
  },
  upload: function(file, callback) {
    var client = knox.createClient({
      key: this.options.key,
      secret: this.options.secret,
      bucket: this.options.bucket
    });
    var newFilePath = path.join(this.uploadPath, file.name);
    var self = this;

    client.putFile(file.path, newFilePath, this.headers, function(err, res) {
      if (err) {
        return callback(err);
      }
      file.url = self.options.domain + '/' + newFilePath;
      callback(null, file);
    });
  }
});