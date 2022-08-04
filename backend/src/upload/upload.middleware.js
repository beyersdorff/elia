var multer = require('multer');
const fs = require('fs');

const folderName = '../data/uploads/';


storage = () => {
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
    }

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, folderName)
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })

    return storage;
},

allowedFile = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
        req.fileValidationError = 'Only  files are allowed!';
        return cb(new Error('Only  files are allowed!'), false);
    }
    cb(null, true);
}

module.exports = {
    storage,
    allowedFile
}