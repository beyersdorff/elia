const express = require('express')

const UploadController = require('./upload.controller')

const router = express.Router()

router.post('/', UploadController.uploadFile)

module.exports = router