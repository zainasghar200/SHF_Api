/**
 * VideoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  add: async (req, res) => {
    try {
      let data = req.body;
      let video = {};

      //   let existingUrl = await Video.find();
      //   if (existingUrl.length != 0) {
      //     existingUrl.forEach(element => {
      //       Video.destroyOne({
      //         id: element.id
      //       });
      //     });
      //   }

      var destroyedRecords = await Video.destroy({}).fetch();

      //Video.destroy();
      video = await Video.create({
        url: data.url
      }).fetch();

      if (video) {
        video = await Video.findOne({ id: video.id });
        res.ok({
          status: 200,
          data: { video },
          message: "URL Added Successfully"
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
      let video = await Video.find();
      video = video[0];
      if (video) {
        res.ok({
          status: 200,
          data: { video },
          message: "URL retrived"
        });
      } else {
        res.ok({
          status: 404,
          message: "No URL found"
        });
      }
    } catch (e) {
      res.status(401).send({
        errors: e.message
      });
    }
  }
};
