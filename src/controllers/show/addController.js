const { auth, firestore } = require("../../firebase/config");
const { getShowDetails, getUnwatched } = require("../../utils/showHelper");

const addController = async (req, res) => {
  try {
    const {
      params: { showId },
      headers: { token },
    } = req;

    const decodedIdToken = await auth.verifyIdToken(token);
    const uid = decodedIdToken.uid;

    const userDataRef = firestore.collection("userData").doc(uid);

    let show = await getShowDetails(showId);
    let { seasons, numOfAiredEpisodes, numOfWatchedEpisodes } =
      await getUnwatched(showId, show.seasons);
    [
      "created_by",
      "homepage",
      "production_companies",
      "production_countries",
      "spoken_languages",
    ].forEach((key) => delete show[key]);

    await userDataRef.collection("user_shows").doc(showId.toString()).set(show);
    await userDataRef.collection("seasons").doc(showId.toString()).set({
      id: show.id,
      name: show.name,
      seasons,
      poster_path: show.poster_path,
      firstAirDate: show.first_air_date,
      numOfAiredEpisodes,
      numOfWatchedEpisodes,
    });

    res.send("success");
  } catch (error) {
    console.log(error);
  }
};

module.exports = addController;
