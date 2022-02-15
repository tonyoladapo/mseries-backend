// const trakt = require("../apis/trakt");
const tmdb = require("../apis/tmdb");
const moment = require("moment");

const discoverController = async (req, res, next) => {
  try {
    const userGenres = JSON.parse(req.headers.genres);
    const similarShowIds = JSON.parse(req.headers.similar_ids);

    let discoverShows = [];

    discoverShows.push({
      listTitle: "Trending Now 🔥",
      shows: await trending(),
    });
    discoverShows.push({
      listTitle: "Most Anticipated Shows🎬",
      shows: await anticipated(),
    });

    await Promise.all(
      userGenres.map(async ({ id, name }) => {
        discoverShows.push({ listTitle: name, shows: await basedOnGenre(id) });
      })
    );

    await Promise.all(
      similarShowIds.map(async ({ id, name }) => {
        discoverShows.push({
          listTitle: name,
          shows: await moreLikeThis(id),
        });
      })
    );

    res.json(discoverShows);
  } catch (error) {
    next(error);
  }
};

const trending = async () => {
  try {
    const { data } = await tmdb.get("/trending/tv/day");
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

    return data.results;
  } catch (error) {
    console.log(error);
  }
};

const moreLikeThis = async (id) => {
  try {
    const { data } = await tmdb.get(`/tv/${id}/recommendations`);
    return data.results;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { discoverController };
