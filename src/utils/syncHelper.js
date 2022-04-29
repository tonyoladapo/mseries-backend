const { getShowDetails, getSeasonEpisodes } = require("./showHelper");
const moment = require("moment");

const syncShow = async (showId, progress) => {
  try {
    const { seasons, numOfWatchedEpisodes, status } = progress;
    const show = await getShowDetails(showId);

    [
      "created_by",
      "homepage",
      "production_companies",
      "production_countries",
      "spoken_languages",
    ].forEach((key) => delete show[key]);

    if (status !== "Ended" && status !== "Canceled") {
      const promises = [];

      show.seasons.map(({ season_number }) => {
        season_number > 0 &&
          promises.push(getSeasonEpisodes(showId, season_number));
      });

      const unwatched = {
        seasons: {},
      };

      let numOfAiredEpisodes = 0;

      const responses = await Promise.all(promises);
      responses.forEach((season) => {
        const episodesObj = {};
        const episodes = [];

        let numberOfAiredEpisodesInSeason = 0;

        const seasonKey = `season ${season.season_number}`;
        seasons[seasonKey].episodes.map((_episode) => {
          episodesObj[_episode.episode_number] = _episode;
        });

        season.episodes.map((_episode) => {
          let episode = _episode;

          episode.watched = episodesObj[`${episode.episode_number}`]
            ? episodesObj[`${episode.episode_number}`].watched
            : false;

          delete episode.overview;
          delete episode.crew;
          delete episode.guest_stars;

          episodes.push(episode);

          if (moment(episode.air_date).isBefore(moment())) {
            numOfAiredEpisodes++;
            numberOfAiredEpisodesInSeason++;
          }
        });

        const checkCompleted = () => {
          if (seasons[seasonKey]) {
            return (
              seasons[seasonKey].numberOfWatchedEpisodes ===
              numberOfAiredEpisodesInSeason
            );
          }

          return false;
        };

        unwatched.seasons[seasonKey] = {
          episodes,
          completed: checkCompleted(),
          numberOfEpisodes: season.episodes.length,
          numberOfWatchedEpisodes: seasons[seasonKey]
            ? seasons[seasonKey].numberOfWatchedEpisodes
            : 0,
          numberOfAiredEpisodes: numberOfAiredEpisodesInSeason,
        };
      });

      unwatched.numOfAiredEpisodes = numOfAiredEpisodes;
      unwatched.numOfWatchedEpisodes = numOfWatchedEpisodes;

      return { show, progress: { ...progress, ...unwatched } };
    }

    return { show, progress };
  } catch (error) {
    console.log(error);
  }
};

module.exports = { syncShow };
