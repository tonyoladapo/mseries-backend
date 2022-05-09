const tmdb = require("../../apis/tmdb");
const moment = require("moment");

const discoverMoreController = async (req, res) => {
  try {
    const { category, page } = req.query;

    const language = req.query.language;

    tmdb.interceptors.request.use((config) => {
      config.params.language = language;
      return config;
    });

    if (category === "trending") {
      const { data } = await tmdb.get("/trending/tv/day", {
        params: {
          page,
          language,
        },
      });

      res.send(data.results);
    }

    if (category === "anticipated") {
      const { data } = await tmdb.get("/discover/tv", {
        params: {
          page,
          "first_air_date.gte": moment().add("1", "day").format("YYYY-MM-DD"),
          with_status: "1|2|5",
        },
      });

      res.send(data.results);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = discoverMoreController;
