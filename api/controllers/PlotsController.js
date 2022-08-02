/**
 * PlotsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const fs = require("fs");
module.exports = {
  add: async (req, res) => {
    try {
      // get data from request body
      let data = req.body;
      let plot = {};
      let plotCheck = await Plots.find({ plotNumber: data.plotNumber });

      if (plotCheck.length != 0) {
        return res.status(205).send({
          message: "Plot Number Already exist."
        });
      }
      // upload plot's attachment(s) if existing
      req.file("thumbnail").upload(
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
              path: req.protocol + "://" + req.headers.host + "/" + fileName
            }).fetch();

            // create plot with attachment(s)
            plot = await Plots.create({
              plotNumber: data.plotNumber,
              price: data.price,
              bedRooms: data.bedRooms,
              area: data.area,
              areaUnit: data.areaUnit,
              unitType: data.unitType,
              premittedUse: data.premittedUse,
              buildingType: data.buildingType,
              status: data.status,
              thumbnail: attachment.id
            }).fetch();
          } else {
            // create plot without attachment(s)
            plot = await Plots.create({
              plotNumber: data.plotNumber,
              price: data.price,
              bedRooms: data.bedRooms,
              area: data.area,
              areaUnit: data.areaUnit,
              unitType: data.unitType,
              premittedUse: data.premittedUse,
              buildingType: data.buildingType,
              status: data.status
            }).fetch();
          }

          // if plot created successfully
          // then send created plot in response
          if (plot) {
            plot = await Plots.findOne({ id: plot.id }).populateAll();
            res.ok({
              status: 200,
              data: { plot },
              message: "Plot created successfully"
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
  update: async (req, res) => {
    try {
      // get plotId from request params
      let id = req.params.id;
      let data = req.body;

      let plotCheck = await Plots.find({ plotNumber: data.plotNumber });

      if (plotCheck.length != 0) {
        plotCheck = plotCheck[0];
        if (plotCheck.id != id) {
          return res.status(205).send({
            message: "Plot Number Already exist."
          });
        }
      }
      // update plot data
      let updatedPlot = await Plots.updateOne({ id }).set(req.body);
      updatedPlot = await Plots.findOne({ id }).populateAll();

      // if plot data updated successfully then update the plot thumbnail
      // update plot thumbnail if exists
      req.file("thumbnail").upload(
        {
          dirname: "../../uploads/"
        },
        async (err, uploadedFiles) => {
          // if file uploading fails
          if (err) {
            return res.status(500).send(err);
          }
          // if thumbnail is not changed
          if (_.isEmpty(uploadedFiles)) {
            return res.ok({
              status: 200,
              data: {
                plots: updatedPlot
              },
              message: "Plot updated successfully"
            });
          } else {
            // if file uploading succeed then thumbnail is changed
            if (uploadedFiles[0].fd.includes("..")) {
              while (uploadedFiles[0].fd.includes("..")) {
                uploadedFiles[0].fd = uploadedFiles[0].fd.replace(`..\\`, ``);
              }
            }

            // if plot has a thumbnail remove existing one
            if (updatedPlot.thumbnail.length > 0) {
              // Remove the thumbnail attachment
              let deletedAttachment = await Attachments.destroyOne({
                id: updatedPlot.thumbnail[0].id
              });

              // if thumbnail attachment deletion succeeds
              // then remove its associated image file from uploads
              if (deletedAttachment) {
                fs.unlink("uploads/" + deletedAttachment.name, async err => {
                  if (err) console.log(err);
                  else
                    console.log(
                      `Plot Attachment deleted successfully with id: ${deletedAttachment.id}`
                    );
                });
              } else {
                // if attachment deletion fails
                return res.status(401).send({
                  errors: `Plot's associated attachment coudn't be deleted.`
                });
              }
            }

            // create and fetch new attachment
            let fileName = "";
            if (req.headers.host === "localhost:1337")
              fileName = uploadedFiles[0].fd.split("\\").pop();
            else fileName = uploadedFiles[0].fd.split("/").pop();

            let attachment = await Attachments.create({
              name: fileName,
              originalName: uploadedFiles[0].filename,
              path: req.protocol + "://" + req.headers.host + "/" + fileName
            }).fetch();

            // update plot's thumbnail
            updatedPlot = await Plots.updateOne({ id }).set({
              thumbnail: attachment.id
            });

            // if plot's thumbnail updated successfully
            if (updatedPlot) {
              updatedPlot = await Plots.findOne({ id }).populateAll();
              return res.ok({
                status: 200,
                data: {
                  plots: updatedPlot
                },
                message: "Plot updated successfully"
              });
            } else {
              res.status(401).send({
                errors: `Plot couldn't be updated`
              });
            }
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
      // Get plotId from request.params
      let id = req.params.id;

      // Get complete plot object along with its associations
      let plot = await Plots.find({ id }).populateAll();

      // if plot has a thumbnail
      if (plot.thumbnail) {
        // Remove the thumbnail attachment
        let deletedAttachment = await Attachments.destroyOne({
          id: plot.thumbnail.id
        });

        // if thumbnail attachment deletion succeeds
        // then remove its associated image file from uploads
        if (deletedAttachment) {
          fs.unlink("uploads/" + deletedAttachment.name, async err => {
            if (err) console.log(err);
            else
              console.log(
                `Plot Attachment deleted successfully with id: ${attachment.id}`
              );
          });
        } else {
          // if attachment deletion fails
          res.status(401).send({
            error: `Plot's associated attachment coudn't be deleted.`
          });
        }
      }

      // now delete the plot
      let deletedPlot = await Plots.destroyOne({ id });
      // if plot deletion succeeds
      if (deletedPlot) {
        res.ok({
          status: 200,
          data: { plots: deletedPlot },
          message: `Plot deleted successfully`
        });
      }
      // if plot deletion fails
      else {
        res.status(401).send({
          message: `Plot couldn't be deleted`
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
      let plots = await Plots.find().populateAll();
      if (plots) {
        res.ok({
          status: 200,
          data: { plots },
          message: "Plots fetched successfully"
        });
      } else {
        res.ok({
          status: 200,
          message: "No plots found"
        });
      }
    } catch (e) {
      res.status(401).send({
        errors: e.message
      });
    }
  },
  find: async (req, res) => {
    try {
      // get plotId from request. params
      let id = req.params.id;

      // fetch complete plot object
      let plot = await Plots.findOne({ id }).populateAll();

      // if plot found
      if (plot) {
        res.ok({
          status: 200,
          data: { plots: plot },
          message: "Plot fetched successfully"
        });
      } else {
        // if plot not found
        res.status(404).send({
          status: 404,
          message: "Plot not found"
        });
      }
    } catch (e) {
      res.status(401).send({
        errors: e.message
      });
    }
  },
  findByPlotNumber: async (req, res) => {
    try {
      // get plot numbe from request. params
      let plotNumber = req.params.id;

      // fetch complete plot object
      let plot = await Plots.find({ plotNumber: plotNumber }).populateAll();

      // if plot found
      if (plot.length != 0) {
        res.ok({
          status: 200,
          data: { plots: plot[0] },
          message: "Plot fetched successfully"
        });
      } else {
        // if plot not found
        res.status(404).send({
          status: 404,
          message: "Plot not found"
        });
      }
    } catch (e) {
      res.status(401).send({
        errors: e.message
      });
    }
  },
  appointment: async (req, res) => {
    try {
      // get data from request body
      let data = req.body;
      let plot = {};
    } catch {
      res.status(401).send({
        errors: e.message
      });
    }
  }
};
