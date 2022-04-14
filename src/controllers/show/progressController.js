const { auth, firestore } = require("../../../firebase-config");

const progressController = async (req, res) => {
  try {
    const {
      params: { showId },
      headers: { token },
    } = req;

    const decodedIdToken = await auth.verifyIdToken(token);
    const uid = decodedIdToken.uid;

    const userDataRef = firestore.collection("userData").doc(uid);
    const seasonsSnapshot = await userDataRef
      .collection("seasons")
      .doc(showId.toString())
      .get();

    const progress = seasonsSnapshot.exists ? seasonsSnapshot.data() : {};
    res.send(progress);
  } catch (error) {
    console.log(error);
  }
};

module.exports = progressController;
