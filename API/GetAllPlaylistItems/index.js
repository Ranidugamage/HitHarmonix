const axios = require('axios');

// Function to fetch tracks from a playlist by its ID
async function fetchTracksFromPlaylist(playlistId, accessToken) {
  //console.log('Fetching tracks from playlist');
  try {
    const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Process the response data and extract the required information
    const playlistDetails = {
      playlistId,
      tracks: response.data.items.map((item) => ({
        trackId: item.track.id,
        trackName: item.track.name,
        artistName: item.track.artists[0].name,
      })),
    };

    return playlistDetails;
  } catch (error) {
    console.error(`Error fetching playlist ${playlistId}: ${error.message}`);
    return null;
  }


}

//export playlistDetails to be used in other files
module.exports = {
  fetchTracksFromPlaylist
 };