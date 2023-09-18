const fetchTracks = require("./API/GetAllPlaylistItems/index.js");
const authOptions = require("./API/TokenAccessAPI/index.js");
const fetchToken = require("./API/TokenAccessAPI/index.js");

const playlistIds = [
  "37i9dQZF1DX4QcmlTAbT3k",
  "37i9dQZF1DX4QcmlTAbT3k",
  "37i9dQZF1DX4QcmlTAbT3k",
  "37i9dQZF1DX4QcmlTAbT3k",
  "37i9dQZF1DX4QcmlTAbT3k",
  "37i9dQZF1DX4QcmlTAbT3k",
  "37i9dQZF1DX4QcmlTAbT3k",
  "37i9dQZF1DX4QcmlTAbT3k",
  "37i9dQZF1DX4QcmlTAbT3k",
  "37i9dQZF1DX4QcmlTAbT3k",
  "37i9dQZF1DX4QcmlTAbT3k",
  "37i9dQZF1DX4QcmlTAbT3k",
  "37i9dQZF1DX4QcmlTAbT3k",
  "37i9dQZF1DX4QcmlTAbT3k",
  "37i9dQZF1DX4QcmlTAbT3k",
  "37i9dQZF1DX4QcmlTAbT3k",
  "37i9dQZF1DX4QcmlTAbT3k",
  "37i9dQZF1DX4QcmlTAbT3k",
  "37i9dQZF1DX4QcmlTAbT3k",
  "37i9dQZF1DX4QcmlTAbT3k",
];

function splitAndConcatArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    const chunk = array.slice(i, i + size);
    if (chunk.length > 0) {
      result.push(chunk.join(", "));
    }
  }
  return result;
}

(async () => {
  try {
    const tracks = [];
    const accessToken = await fetchToken.fetchToken();
    const concatedTracks = splitAndConcatArray(playlistIds, 16);
    for (let i = 0; i < concatedTracks.length; i++) {
      const results = await fetchTracks.fetchTracksFromPlaylist(
        accessToken,
        concatedTracks[0]
      );
      tracks.push(results);
    }
  } catch (error) {
    console.error("Error:", error);
  }
})();
