/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = {
  login: async (req, res) => {
    try {
      //errors object
      let errors = {};

      // validating input
      if (!_.has(req.body, "email")) {
        errors.email = "Email is missing";
      }
      if (!_.has(req.body, "password")) {
        errors.password = "Password is missing";
      }
      if (!errors.email && !validator.isEmail(req.body.email)) {
        errors.email = "Email is invalid";
      }

      // if errors exists
      if (!_.isEmpty(errors)) {
        res.status(422).send({
          errors
        });
      } else {
        // checking email existence
        Users.findOne({
          email: req.body.email
        })
          .populateAll()
          .exec((err, user) => {
            if (err) {
              return res.serverError({ errors: err });
            }
            if (!user) {
              errors.email = "Email not found, please sign up";
              //return res.serverError({ errors });
              return res.ok({
                status: 401,
                message: "Invalid Email or Password"
              });
            }

            // comparing hashed passwords
            bcrypt.compare(
              req.body.password,
              user.password,
              async (error, matched) => {
                if (error) {
                  return res.serverError(error);
                }
                if (!matched) {
                  errors.password = "Invalid password";

                  //return res.serverError({ errors });
                  return res.ok({
                    status: 401,
                    message: "Invalid Email or Password"
                  });
                }

                let token = jwt.sign(user, sails.config.session.secret, {});

                RedisService.set(user.id, token, () => {
                  console.log(
                    "---> User token successfully written on redis service."
                  );
                });

                res.ok({
                  status: 200,
                  data: { token, user },
                  message: "User logged in successfully"
                });
              }
            );
          });
      }
    } catch (e) {
      return res.status(401).send({
        error: e.message
      });
    }
  },
  logout: async (req, res) => {
    try {
      // errors object
      let errors = {};

      // checking token existence
      if (!req.header("Authorization")) {
        errors.token = "Authorization token is missing";
        res.status(422).send({
          errors
        });
      }

      // preparing and verifying token
      const token = req.header("Authorization").replace("Bearer ", "");
      const user = await jwt.verify(token, sails.config.session.secret);

      // deleting user from redis
      await RedisService.del(user.id, () => {
        res.status(200).json({
          status: 200,
          data: { user },
          message: "User logged out successfully"
        });
      });
    } catch (e) {
      res.status(401).send({
        errors: e.message
      });
    }
  },
  changePassword: async (req, res) => {
    try {
      // errors object
      let errors = {};

      // validating input
      if (!_.has(req.body, "id")) {
        errors.id = "id is missing";
      }
      if (!_.has(req.body, "oldPassword")) {
        errors.oldPassword = "old password is missing";
      }
      if (!_.has(req.body, "newPassword")) {
        errors.newPassword = "new password is missing";
      }

      // if input is invalid
      if (!_.isEmpty(errors)) {
        res.status(422).send({
          errors
        });
      }

      // destructring response object
      let { id, oldPassword, newPassword } = req.body;

      // checking user existence
      await Users.findOne({ id }).exec(async (err, user) => {
        if (err) {
          return res.serverError({ errors: err });
        }
        if (!user) {
          errors.user = "User not found, please sign up";
          return res.serverError({ errors });
        }

        // checking old password
        bcrypt.compare(oldPassword, user.password, async (error, matched) => {
          if (error) {
            return res.serverError({ errors: error });
          }
          if (!matched) {
            errors.password = "Old password is incorrect";
            return res.serverError({ errors });
          }

          // updating password
          await Users.update({ id: user.id })
            .set({ password: newPassword })
            .then(user => {
              res.ok({
                status: 200,
                message: "Password changed successfully"
              });
            });
        });
      });
    } catch (e) {
      res.status(401).send({
        errors:
          "You are not permitted to perform this action. Unauthorized, Invalid request."
      });
    }
  }
};
