const axios = require("axios");

const trakt = axios.create({
  baseURL: "https://api.trakt.tv",
  headers: {
    "Content-Type": "application/json",
    "trakt-api-version": 2,
    "trakt-api-key": process.env.TRAKT_API_KEY,
  },
});

trakt.interceptors.response.use(undefined, (e) => {
  const statusCode = e.response ? e.response.status : null;
  e.token_expired = statusCode === 401 ? true : false;

  return Promise.reject(e);
});

module.exports = trakt;
