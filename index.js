const fetchTracks = require('./API/GetAllPlaylistItems/index.js');
const authOptions = require('./API/TokenAccessAPI/index.js');
const fetchToken = require('./API/TokenAccessAPI/index.js');

// An array of playlist IDs you want to fetch
const playlistIds = ['37i9dQZF1DX4QcmlTAbT3k'];    // 'playlist_id_1', 'playlist_id_2', 'playlist_id_3'

fetchToken.fetchToken()
  .then((accessToken) => {
    console.log('Access Token:', accessToken);

    // Now you can use the token in the rest of your main index.js logic
    // ...
  })
  .catch((error) => {
    console.error('Error:', error);
  });

// fetchTracks.fetchTracksFromPlaylist(accessToken, playlistIds[0]);

