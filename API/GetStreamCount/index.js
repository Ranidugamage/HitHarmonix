const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://spotify-track-streams-playback-count1.p.rapidapi.com/tracks/spotify_track_streams',
  params: {
    spotify_track_id: '',
    isrc: 'CA5KR1821202'
  },
  headers: {
    'X-RapidAPI-Key': 'ec124f4d49msh5911388f8a039b3p17061ajsn04f829578691',
    'X-RapidAPI-Host': 'spotify-track-streams-playback-count1.p.rapidapi.com'
  }
};

try {
	const response = await axios.request(options);
	console.log(response.data);
} catch (error) {
	console.error(error);
}