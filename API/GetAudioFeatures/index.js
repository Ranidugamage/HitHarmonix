const axios = require('axios');

// Function to fetch audio features for a batch of track IDs
async function fetchAudioFeatures(accessToken, trackIds) {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/audio-features?ids=${trackIds.join(',')}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Process the audio features response data as needed
    const audioFeatures = response.data.audio_features;

    return audioFeatures;
  } catch (error) {
    console.error('Error fetching audio features:', error.message);
    return null;
  }
}

module.exports = {
  fetchAudioFeatures,
};