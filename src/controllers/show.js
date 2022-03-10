const tmdb = require("../apis/tmdb");
const moment = require("moment");

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

    data.seasons.forEach(({ season_number }) => {
      season_number > 0 &&
        promises.push(getSeasonEpisodes(showId, season_number));
    });

    const unwatched = {
      seasons: {},
    };

    await Promise.all(promises).then((response) => {
      let numOfWatched = 0;
      let numOfAiredEpisodes = 0;

      response.forEach((season) => {
        const episodes = [];

        season.episodes.map((_episode) => {
          let episode = _episode;

          delete episode.overview;
          delete episode.crew;
          delete episode.guest_stars;

          episodes.push(episode);

          if (moment(episode.air_date).isBefore(moment())) numOfAiredEpisodes++;
        });

        unwatched.numOfAiredEpisodes = numOfAiredEpisodes;
        unwatched.numOfWatchedEpisodes = numOfWatched;
        unwatched.seasons[`season ${season.season_number}`] = episodes;
      });
    });

    res.json(unwatched);
  } catch (error) {
    console.log(error);
  }
};

const syncController = async (req, res) => {
  try {
    const language = req.query.language;

    tmdb.interceptors.request.use((config) => {
      config.params.language = language;
      return config;
    });

    const shows = JSON.parse(req.query.shows);

    const promises = [];

    shows.map(async (id) => {
      promises.push(getShowDetails(id));
    });

    const response = await Promise.all(promises);
    const showIds = response.map(async (show) => {
      const showDetails = {
        overview: show.overview,
        origin_country: show.origin_country,
        poster_path: show.poster_path,
        name: show.name,
        id: show.id,
        original_name: show.original_name,
        first_air_date: show.first_air_date,
        popularity: show.popularity,
        vote_average: show.vote_average,
        vote_count: show.vote_count,
        backdrop_path: show.backdrop_path,
        genre_ids: show.genres.map(({ id }) => id),
        original_language: show.original_language,
      };

      const seasonPromises = [];

      show.seasons.forEach(async ({ season_number }) => {
        season_number > 0 &&
          seasonPromises.push(getSeasonEpisodes(show.id, season_number));
      });

      const unwatched = {};

      let numOfAiredEpisodes = 0;

      await Promise.all(seasonPromises).then((response) => {
        response.forEach((season) => {
          season.episodes.map((episode) => {
            if (moment(episode.air_date).isBefore(moment()))
              numOfAiredEpisodes++;
          });

          unwatched[`season ${season.season_number}`] = season.episodes;
        });
      });

      return {
        showDetails,
        unwatched: {
          [show.id]: {
            firstAirDate: show.first_air_date,
            id: show.id,
            name: show.name,
            poster_path: show.poster_path,
            seasons: unwatched,
            numOfAiredEpisodes,
          },
        },
      };
    });

    await Promise.all(showIds).then((response) => {
      res.json(response);
    });
  } catch (error) {
    console.log(error);
  }
};

const getShowDetails = async (showId) => {
  try {
    const { data } = await tmdb.get(`/tv/${showId}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getSeasonEpisodes = async (showId, seasonNumber) => {
  try {
    const { data } = await tmdb.get(`/tv/${showId}/season/${seasonNumber}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { unwatchedController, syncController };
