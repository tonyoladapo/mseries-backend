const tmdb = require("../apis/tmdb");
const moment = require("moment");

const getShowDetails = async (showId) => {
  try {
    const { data } = await tmdb.get(`/tv/${showId}`);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

const getUnwatched = async (showId, seasons) => {
  try {
    const promises = [];

    seasons.forEach(({ season_number }) => {
      season_number > 0 &&
        promises.push(getSeasonEpisodes(showId, season_number));
    });

    const unwatched = {
      seasons: {},
    };

    let numOfWatched = 0;
    let numOfAiredEpisodes = 0;

    const responses = await Promise.all(promises);
    responses.forEach((season) => {
      const episodes = [];

      let numberOfAiredEpisodesInSeason = 0;

      season.episodes.map((_episode) => {
        let episode = _episode;

        episode.watched = false;

        delete episode.overview;
        delete episode.crew;
        delete episode.guest_stars;

        episodes.push(episode);

        if (moment(episode.air_date).isBefore(moment())) {
          numOfAiredEpisodes++;
          numberOfAiredEpisodesInSeason++;
        }
      });

      unwatched.numOfAiredEpisodes = numOfAiredEpisodes;
      unwatched.numOfWatchedEpisodes = numOfWatched;
      unwatched.seasons[`season ${season.season_number}`] = {
        episodes,
        completed: false,
        numberOfEpisodes: season.episodes.length,
        numberOfWatchedEpisodes: 0,
        numberOfAiredEpisodes: numberOfAiredEpisodesInSeason,
      };
    });

    return unwatched;
  } catch (error) {
    throw new Error(error);
  }
};

const getSeasonEpisodes = async (showId, seasonNumber) => {
  try {
    const { data } = await tmdb.get(`/tv/${showId}/season/${seasonNumber}`);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { getShowDetails, getUnwatched, getSeasonEpisodes };
