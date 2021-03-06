const fs = require("fs");
const {google} = require('googleapis');

function imageUpload(fileName, filePath, folder, callback){
    require("./gdrive-auth")((auth) => {
        const fileMetadata = {
            name: fileName,
            parents: [folder]
        };

        const media = {
            mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            body: fs.createReadStream(filePath)
        }
        const drive = google.drive({version: 'v3', auth});
        drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id'
          }, function (err, file) {
            if (err) {
              // Handle error
              console.error(err);
            } else {
              callback(file.data.id);
            }
          });
    });
}

module.exports = { imageUpload };
