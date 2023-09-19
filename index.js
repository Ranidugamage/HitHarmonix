// const fetchTracks = require("./API/GetAllPlaylistItems/index.js");
// const authOptions = require("./API/TokenAccessAPI/index.js");
const fetchToken = require("./API/TokenAccessAPI/index.js");
const fs = require('fs');
const { fetchTracksFromPlaylist } = require('./API/GetAllPlaylistItems/index.js');
const { fetchAudioFeatures } = require('./API/GetAudioFeatures/index.js');
const json2csv = require('json2csv').parse;


const playlistIds = [
  "37i9dQZF1DX4QcmlTAbT3k?si=08e8b5ee37fe446e",
  "5Iu0RFS1LahINedPFxKEuR?si=0e2169af63c741cd",
  "2ZXRC54xDGfgiTWeMYw1Qr?si=4b76362d4cc7435d",
  "2PEVzGGJIcAY4iVHj97AuB?si=220fb7aa356a4df4",
  "5Z6oIyGPbhFFr0qpQd4l2t?si=f10b1b00119a4f46",
  "1qvpF0tJLys2em53L8Bkaj?si=b097cb5e65f145f1",
  "1JFNXyGjChMTCO7lSJ8H15?si=090cf5c994e8465f",
  "37i9dQZF1DX2W325UQHpcp?si=0684da5b9ae44738",
  "37i9dQZF1DWWfcT0iJ1Nwd?si=0e574bdfffae44d7",
  "37i9dQZF1DX0GQpnYTkXVR?si=f093f682f6a141a2",
  "37i9dQZF1DWSo1plf4t3cl?si=e298f403b459415a"
  
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

// (async () => {
//   try {
//     const accessToken = await fetchToken.fetchToken();
//     const batchSize = 100; // Maximum batch size for audio features API
//       console.log(accessToken);
//     // Fetch and combine all tracks from multiple playlists
//     const allTracks = [];
//     for (const playlistId of playlistIds) {
//       const tracks = await fetchTracksFromPlaylist(playlistId, accessToken);
//       if (tracks && tracks.length > 0) {
//         allTracks.push(...tracks);
//       }
//       console.log(allTracks);
//     }

//     //Split the track IDs into batches for audio feature retrieval
//     const trackIdsToFetch = allTracks.map(track => track.trackId);
//     const trackIdBatches = splitAndConcatArray(trackIdsToFetch, batchSize);

//     const audioFeaturesArray = [];

//     // Fetch audio features for each batch of track IDs
//     for (const trackIdBatch of trackIdBatches) {
//       const audioFeatures = await fetchAudioFeatures(accessToken, trackIdBatch);
//       if (audioFeatures) {
//         audioFeaturesArray.push(...audioFeatures);
//       }

//       // Add a time gap (e.g., 1 second) before making the next request
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//     }

//     // Combine track details and audio features into a single array of objects
//     const combinedData = allTracks.map((track, index) => ({
//       playlistId: track.playlistId,
//       trackId: track.trackId,
//       trackName: track.trackName,
//       artistName: track.artistName,
//       streamCount: track.popularity, 
//       ...audioFeaturesArray[index],
//     }));

    // Convert the combined data to CSV format using json2csv
    // const csv = json2csv(combinedData);

    // // Write the CSV data to a file
    // fs.writeFileSync('audio_features.csv', csv, 'utf-8');

    // console.log('CSV file saved: audio_features.csv');
//   } 
  
//   catch (error) {
//     console.error("Error:", error);
  
//   }
//  }

// )

// ();