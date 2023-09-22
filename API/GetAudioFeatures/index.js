const axios = require("axios");

async function fetchAudioFeatures(accessToken, trackIds) {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/audio-features?ids=${trackIds}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const audioFeatures = response.data.audio_features;

    return audioFeatures;
  } catch (error) {
    console.error("Error fetching audio features:", error.message);
    return null;
  }
}

module.exports = {
  fetchAudioFeatures,
};
