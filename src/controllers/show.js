const tmdb = require("../apis/tmdb");

const unwatchedController = async (req, res) => {
  try {
    const language = req.query.language;

    tmdb.interceptors.request.use((config) => {
      config.params.language = language;
      return config;
    });

    const { showId } = req.params;
    const { data } = await tmdb.get(`/tv/${showId}`);

    const promises = [];

    data.seasons.forEach(async ({ season_number }) => {
      season_number > 0 &&
        promises.push(getSeasonEpisodes(showId, season_number));
    });

    const unwatched = {};

    await Promise.all(promises).then((response) => {
      response.forEach((season) => {
        unwatched[`season ${season.season_number}`] = season.episodes;
      });
    });

    res.json({ [showId]: unwatched });
  } catch (error) {
    console.log(error);
  }
};

// const showDetailsController = async (req, res) => {
//   try {
//     const language = req.query.language;

//     tmdb.interceptors.request.use((config) => {
//       config.params.language = language;
//       return config;
//     });

//     const { showId } = req.params;
//     const { data } = await tmdb.get(`/tv/${showId}`);

//     const promises = [];

//     data.seasons.forEach(async ({ season_number }) => {
//       season_number > 0 &&
//         promises.push(getSeasonEpisodes(showId, season_number));
//     });

//     const unwatched = {};

//     await Promise.all(promises).then((response) => {
//       response.forEach((season) => {
//         unwatched[`season ${season.season_number}`] = season;
//       });
//     });

//     res.json({ ...data, unwatched });
//   } catch (error) {
//     console.log(error);
//   }
// };

const getSeasonEpisodes = async (showId, seasonNumber) => {
  try {
    const { data } = await tmdb.get(`/tv/${showId}/season/${seasonNumber}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { showDetailsController, unwatchedController };
