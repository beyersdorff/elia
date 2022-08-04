var multer  = require('multer');
var fileUpload= require('./upload.middleware');

uploadFile = (req, res) => {
    var upload = multer({
        storage: fileUpload.storage(),
        allowedFile:fileUpload.allowedFile
    }).single('file');

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.send(err);
            console.error(err)
        } else if (err) {
            res.send(err);
            console.error(err)
        } else {
            return res.status(201).json({
                success: true,
                message: 'File uploaded!',
            })
        }
    })
}

module.exports = {
    uploadFile
}