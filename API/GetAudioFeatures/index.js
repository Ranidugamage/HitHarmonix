const axios = require('axios');
const fs = require('fs');
const { parse } = require('json2csv');
const  playlistDetails  = require('../GetAllPlaylistItems/index.js');
// const playlistDetails = require('../GetAllPlaylistItems/index.js');

// Your Spotify API access token - replace with your own
const accessToken = 'BQDWp4K8tjI5TxjqjVMaUFdfWoZvSJBlrHQlHQFBqyGsGUTK9ks9DZRBlla8FJB2U_zs1xSAJObJzs1xleGghkfqf4-Rahwh3KVmNCBidNsL3DGBubE';

// Function to fetch audio features for a batch of track IDs
async function fetchAudioFeatures(trackIds) {
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

// Function to split an array into chunks of a specified size
function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

// Example usage: provide an array of track IDs to fetch audio features
const trackIdsToFetch = [playlistDetails.trackId]; //'track_id_1', 'track_id_2', 'track_id_3'

// Define the batch size for fetching audio featurescd ..
const batchSize = 100;

// Split the track IDs into batches
const trackIdBatches = chunkArray(trackIdsToFetch, batchSize);

const audioFeaturesArray = [];

// Fetch audio features for each batch of track IDs
async function fetchAudioFeaturesForAllBatches() {
  for (const trackIdBatch of trackIdBatches) {
    const audioFeatures = await fetchAudioFeatures(trackIdBatch);

    if (audioFeatures) {
      audioFeaturesArray.push(...audioFeatures);
    }

    // Add a time gap (e.g., 1 second) before making the next request
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

// Call the function to fetch audio features for all batches
fetchAudioFeaturesForAllBatches()
  .then(() => {
    // Here, audioFeaturesArray contains audio features for all tracks
    console.log('Audio Features:', audioFeaturesArray);

    // Combine track details and audio features into a single array of objects
    const combinedData = trackIdsToFetch.map((trackId, index) => ({
      trackId,
      trackName: 'track_name_' + index, // Replace with actual track name
      artistName: 'artist_name_' + index, // Replace with actual artist name
      ...audioFeaturesArray[index],
    }));

    // Convert the combined data to CSV format using json2csv
    const csv = parse(combinedData, { fields: Object.keys(combinedData[0]) });

    // Write the CSV data to a file
    fs.writeFileSync('audio_features.csv', csv, 'utf-8');

    console.log('CSV file saved: audio_features.csv');
  })
  .catch((err) => {
    console.error('Error:', err);
  });
