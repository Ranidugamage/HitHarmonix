const fetchTracks = require("./API/GetAllPlaylistItems/index.js");
const fetchToken = require("./API/TokenAccessAPI/index.js");
const audioFeatures = require("./API/GetAudioFeatures/index.js");
const fs = require("fs");

const playlistIds = [
  "37i9dQZF1DX4QcmlTAbT3k",
  "5Iu0RFS1LahINedPFxKEuR",
  "2ZXRC54xDGfgiTWeMYw1Qr",
  "2PEVzGGJIcAY4iVHj97AuB",
  "5Z6oIyGPbhFFr0qpQd4l2t",
  "1qvpF0tJLys2em53L8Bkaj",
  "1JFNXyGjChMTCO7lSJ8H15",
  "37i9dQZF1DX2W325UQHpcp",
  "37i9dQZF1DWWfcT0iJ1Nwd",
  "37i9dQZF1DX0GQpnYTkXVR",
  "37i9dQZF1DWSo1plf4t3cl",
];

function splitAndConcatArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    const chunk = array.slice(i, i + size);
    if (chunk.length > 0) {
      result.push(chunk.join(","));
    }
  }
  return result;
}

(async () => {
  try {
    let tracks = [];
    let audioFeaturesList = [];
    const accessToken = await fetchToken.fetchToken();

    for (const playlistId of playlistIds) {
      const results = await fetchTracks.fetchTracksFromPlaylist(
        playlistId,
        accessToken
      );

      tracks.push(...results);
    }
    const trackIds = tracks.map((item) => item.trackId);
    const concatedTracks = splitAndConcatArray(trackIds, 10);

    for (const trackId of concatedTracks) {
      const trackAudioFeatures = await audioFeatures.fetchAudioFeatures(
        accessToken,
        trackId
      );
      //need to add artistname and songname
      audioFeaturesList.push(...trackAudioFeatures);
    }
    const jsonData = JSON.stringify(audioFeaturesList, null, 2);

    fs.writeFile("data.json", jsonData, (err) => {
      if (err) {
        console.error("Error writing JSON file:", err);
      } else {
        console.log("JSON file has been created successfully.");
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
})();
