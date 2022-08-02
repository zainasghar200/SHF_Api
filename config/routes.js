/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  // Default View Page
  "/": { view: "pages/homepage" },

  // Auth Controller Routes
  "POST /api/v1/auth/login": "AuthController.login", //Done
  "GET /api/v1/auth/logout": "AuthController.logout", //Done
  "POST /api/v1/auth/change-password/": "AuthController.changePassword", //Done

  // Attchments Controller Routes
  "POST /api/v1/attachments/upload": "AttachmentsController.uploadFile", //Done
  // "POST /api/v1/attachments/delete": "AttachmentsController.deleteFile", //Done
  // "GET /api/v1/attachments/delete": "AttachmentsController.deleteFile", //Done
  "GET /api/v1/attachments": "AttachmentsController.get", //Done
  "DELETE /api/v1/attachments/:id": "AttachmentsController.delete",

  // Plots Controller Routes
  "GET /api/v1/plots": "PlotsController.get", //Done
  "POST /api/v1/plots": "PlotsController.add", //Done
  "PATCH /api/v1/plots/:id": "PlotsController.update",
  "DELETE /api/v1/plots/:id": "PlotsController.delete",
  "GET /api/v1/plots/:id": "PlotsController.find", //Done
  "GET /api/v1/plots/findByPlotNumber/:id": "PlotsController.findByPlotNumber", //Done
  "POST /api/v1/plots/appointment": "PlotsController.appointment", //Done

  // appointment Controller Routes
  "GET /api/v1/appointment": "AppointmentController.get", //Done
  "POST /api/v1/appointment": "AppointmentController.add", //Done

  // Video Controller Routes
  "GET /api/v1/video": "VideoController.get", //Done
  "POST /api/v1/video": "VideoController.add" //Done
};
