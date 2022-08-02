/**
 * Attatchments.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    name: {
      type: "string",
      required: true
    },
    path: {
      type: "string",
      required: true
    },
    originalName: {
      type: "string",
      required: true
    },
    type: {
      type: "string"
    },
    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    plotsThumbnail: {
      model: "plots"
    }
    // usersThumbnail: {
    //   model: "users"
    // },
    // addsThumbnail: {
    //   model: "adds"
    // },
    // messagesAttachment: {
    //   model: "messages"
    // },
    // coversationAttachments: {
    //   model: "conversations"
    // },
    // addsAttachment: {
    //   model: "adds"
    // },
    // categories: {
    //   model: "categories"
    // },
    // channels: {
    //   model: "channels"
    // }
  }
};
