const multer  = require('multer');
const profileMaxSize = 0.1 * 1024 * 1024;
const storageProfile = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/profiles');
    },
    filename: (req, file, cb) => {
      console.log(file);
      let filetype = '';
      if(file.mimetype === 'image/gif') {
        filetype = 'gif';
      }
      if(file.mimetype === 'image/png') {
        filetype = 'png';
      }
      if(file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
      }
      cb(null, req.username + '.' + filetype);
    }
});
const uploadProfile = multer({
    storage: storageProfile, 
    limits: { fileSize: profileMaxSize }
}).single('profileImage');

const profile = {
    uploadingProfile: uploadProfile,
};
module.exports = profile;