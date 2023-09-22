const axios = require("axios");

async function fetchTracksFromPlaylist(playlistId, accessToken) {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          limit: 50,
        },
      }
    );

    const playlistDetails = response.data.items.map((item) => ({
      trackId: item.track.id,
      trackName: item.track.name,
      artistName: item.track.artists[0].name,
    }));

    return playlistDetails;
  } catch (error) {
    console.error(`Error fetching playlist ${playlistId}: ${error.message}`);
    return null;
  }
}

module.exports = {
  fetchTracksFromPlaylist,
};
