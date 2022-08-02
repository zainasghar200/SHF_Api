/**
 * AttatchmentsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const fs = require("fs");

module.exports = {
  uploadFile: async (req, res) => {
    try {
      req.file("attachment").upload(
        {
          dirname: "../../uploads/"
        },
        async (err, uploadedFiles) => {
          // if file uploading fails
          if (err) {
            return res.send(500, err);
          }
          if (!_.isEmpty(uploadedFiles)) {
            // if file uploading succeeds
            if (uploadedFiles[0].fd.includes("..")) {
              while (uploadedFiles[0].fd.includes("..")) {
                uploadedFiles[0].fd = uploadedFiles[0].fd.replace(`..\\`, ``);
              }
            }

            // create and fetch Attachment
            let fileName = "";
            if (req.headers.host === "localhost:1337")
              fileName = uploadedFiles[0].fd.split("\\").pop();
            else fileName = uploadedFiles[0].fd.split("/").pop();

            let attachment = await Attachments.create({
              name: fileName,
              originalName: uploadedFiles[0].filename,
              path: req.protocol + "://" + req.headers.host + "/" + fileName,
              type: "galleryImage"
            }).fetch();
            if (attachment) {
              let attachments = await Attachments.find({
                type: "galleryImage"
              });
              res.ok({
                status: 200,
                data: { attachments },
                message: "Attachment added successfully"
              });
            }
          } else {
            res.ok({
              status: 404,
              message: "Attachment Not Found"
            });
          }
        }
      );
    } catch (e) {
      res.status(401).send({
        errors: e.message
      });
    }
  },
  delete: async (req, res) => {
    try {
      let id = req.params.id;
      //let attachment = await Attachments.find({ id });
      let deletedAttachment = await Attachments.destroyOne({
        id: id
      });

      if (deletedAttachment) {
        fs.unlink("uploads/" + deletedAttachment.name, async err => {
          if (err) {
            console.log(err);
          } else {
            let attachments = await Attachments.find({
              type: "galleryImage"
            });
            res.ok({
              status: 200,
              data: { attachments },
              message: `Image deleted successfully.`
            });
          }
        });
      } else {
        // if attachment deletion fails
        res.status(401).send({
          error: `Image coudn't be deleted.`
        });
      }
    } catch (e) {
      res.status(401).send({
        errors: e.message
      });
    }
  },
  get: async (req, res) => {
    try {
      let attachments = await Attachments.find({
        type: "galleryImage"
      });
      if (attachments) {
        res.ok({
          status: 200,
          data: { attachments },
          message: "Appointments retrived"
        });
      } else {
        res.ok({
          status: 404,
          message: "No Appointment found"
        });
      }
    } catch (e) {
      res.status(401).send({
        errors: e.message
      });
    }
  },
  createAttachment: async (req, res) => {
    try {
      let attachment = await Attachments.create({
        name: req.name,
        path: req.path,
        originalName: req.originalName
      }).fetch();

      if (attachment) {
        return attachment;
      }
    } catch (e) {
      console.log(e.message);
    }
  }
};
