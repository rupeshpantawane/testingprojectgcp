const fs = require("fs");

const fileUpload = async (fileName, fileObj, basePath) => {
    fs.mkdirSync(basePath, { recursive: true }, function (err) {
        // console.log('mkdir err', err);
        if (err) return false;
    });
    const UploadFullPath = basePath + "/" + fileName;
    fileObj.mv(UploadFullPath, function (err) {
        // console.log('mv err', err, UploadFullPath);
        if (err) return false;
    });
    return true;
}

module.exports = {
    fileUpload
};