const { syncShow } = require("../../utils/syncHelper");
const { auth, firestore } = require("../../firebase/config");

const syncController = async (req, res) => {
  try {
    const {
      body: { progress },
      headers: { token },
    } = req;

    const promises = [];

    Object.keys(progress).forEach((key) => {
      promises.push(syncShow(key, progress[key]));
    });

    const decodedIdToken = await auth.verifyIdToken(token);
    const uid = decodedIdToken.uid;

    const batch = firestore.batch();
    const userDataRef = firestore.collection("userData").doc(uid);

    let obj = {};

    const responses = await Promise.all(promises);
    responses.forEach((response) => {
      const showId = response.show.id;
      obj[showId] = response.progress;

      batch.set(
        userDataRef.collection("user_shows").doc(showId.toString()),
        response.show
      );

      batch.set(
        userDataRef.collection("seasons").doc(showId.toString()),
        response.progress
      );
    });

    await batch.commit();

    res.send(obj);
  } catch (error) {
    console.log(error);
  }
};

module.exports = syncController;
