const tmdb = require("../apis/tmdb");
const moment = require("moment");

const discoverController = async (req, res, next) => {
  try {
    const userGenres = JSON.parse(req.query.genres);
    const similarShowIds = JSON.parse(req.query.similar_ids);

    const language = req.query.language;

    tmdb.interceptors.request.use((config) => {
      config.params.language = language;
      return config;
    });

    let discoverShows = [];

    discoverShows.push({
      listTitle: "Trending Now 🔥",
      shows: await trending(language),
    });
    discoverShows.push({
      listTitle: "Most Anticipated Shows🎬",
      shows: await anticipated(),
    });

    await Promise.all(
      userGenres.map(async ({ id, name }) => {
        const res = await basedOnGenre(id);
        discoverShows.push({
          listTitle: name,
          shows: res.shows,
          genre_id: res.genre_id,
        });
      })
    );

    await Promise.all(
      similarShowIds.map(async ({ id, name }) => {
        const res = await moreLikeThis(id);
        discoverShows.push({
          listTitle: name,
          shows: res.shows,
          show_id: res.show_id,
        });
      })
    );

    res.json(discoverShows);
  } catch (error) {
    console.log(error);
  }
};

const trending = async (language) => {
  try {
    const { data } = await tmdb.get("/trending/tv/day", {
      params: {
        language,
      },
    });
    return data.results;
  } catch (error) {
    console.log(error);
  }
};

const anticipated = async () => {
  try {
    const { data } = await tmdb.get("/discover/tv", {
      params: {
        "first_air_date.gte": moment().add("1", "day").format("YYYY-MM-DD"),
        with_status: "1|2|5",
      },
    });
    return data.results;
  } catch (error) {
    console.log(error);
  }
};

const basedOnGenre = async (genreId) => {
  try {
    const { data } = await tmdb.get("/discover/tv", {
      params: {
        with_genres: genreId,
      },
    });

    return { shows: data.results, genre_id: genreId };
  } catch (error) {
    console.log(error);
  }
};

const moreLikeThis = async (id) => {
  try {
    const { data } = await tmdb.get(`/tv/${id}/recommendations`);
    return { shows: data.results, show_id: id };
  } catch (error) {
    console.log(error);
  }
};

module.exports = { discoverController };
