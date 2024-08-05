const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        //random file name with date
        const fileName = `file${Date.now()}`;
        const fileExt = file.originalname.split('.').pop();
        const fullFileName = `${fileName}.${fileExt}`;
      cb(null, fullFileName)
    }
})

const uploadFile = multer({ storage: storage }).single('file');

module.exports = uploadFile;