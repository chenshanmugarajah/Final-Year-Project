const AWS = require('aws-sdk')
const multer = require('multer')
const multers3 = require('multer-s3')

AWS.config.update({
  region: 'us-east-1'
})