/**
 * Users.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const bcrypt = require("bcryptjs");

module.exports = {
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    email: {
      type: "string",
      required: true,
      unique: true
    },
    phoneNumber: {
      type: "string",
      required: true,
      unique: true
    },
    name: {
      type: "string",
      required: false
    },
    dob: {
      type: "string",
      required: false
    },
    city: {
      type: "string",
      required: false
    },
    password: {
      type: "string",
      required: false
    },
    isAdmin: {
      type: "boolean",
      required: false
    },
    thumbnail: {
      type: "string",
      required: false
    }
    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
  },

  /*
   * this is called so we can create our password hash for us
   *
   * before saving
   * @param values
   * @param cb
   */

  beforeCreate: async (values, next) => {
    if (values.password) {
      bcrypt.hash(values.password, 10, (err, hash) => {
        if (err) {
          return next(err);
        }
        values.password = hash;
        next();
      });
    } else {
      next();
    }
  },
  beforeUpdate: async (values, next) => {
    if (values.password) {
      bcrypt.hash(values.password, 10, (err, hash) => {
        if (err) {
          return next(err);
        }
        values.password = hash;
        next();
      });
    } else {
      next();
    }
  }
};
