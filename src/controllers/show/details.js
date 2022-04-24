const { auth, firestore } = require("../../firebase/config");
const tmdb = require("../../apis/tmdb");

const detailsController = async (req, res) => {
  try {
    const {
      params: { showId },
    } = req;

    const { data } = await tmdb.get(`/tv/${showId}`, {
      params: {
        append_to_response: "similar,videos",
      },
    });

    res.send(data);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = detailsController;
