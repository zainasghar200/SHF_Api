/**
 * AppointmentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var nodemailer = require("nodemailer");
//const send = require("gmail-send")(options);
module.exports = {
  add: async (req, res) => {
    try {
      let data = req.body;
      let appointment = {};
      var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "shalimarhillfarms1@gmail.com",
          pass: "Shalimar22@"
        }
      });

      var mailOptions = {
        from: "shalimarhillfarms1@gmail.com",
        to: "shalimarhillfarms1@gmail.com",
        subject: "User Appointment",
        text: `Hi Shalimar Hill Farms,
        ${data.name} Just booked an appointment details are following:
        
        Email: ${data.email}
        Contact: ${data.contactNumber}
        Message: ${data.message}`
      };
      transporter
        .sendMail(mailOptions)
        .then(result => console.log(result))
        .catch(error => console.error("ERROR", error));

      // const send = require("gmail-send")({
      //   user: "",
      //   pass: "",
      //   to: "xainasghar786@gmail.com",
      //   subject: "test subject",
      //   text: "gmail-send example 1"
      // });

      // send(
      //   {
      //     text: "gmail-send example 1"
      //   },
      //   (error, result, fullResult) => {
      //     if (error) console.error(error);
      //     console.log(result);
      //   }
      // );
      appointment = await Appointment.create({
        name: data.name,
        email: data.email,
        contactNumber: data.contactNumber,
        message: data.message
      }).fetch();

      if (appointment) {
        appointment = await Appointment.findOne({ id: appointment.id });
        res.ok({
          status: 200,
          data: { appointment },
          message: "Appointment Created Successfully"
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
      let appointments = await Appointment.find();
      if (appointments) {
        res.ok({
          status: 200,
          data: { appointments },
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
  }
};
