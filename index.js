const fetchTracks = require("./API/GetAllPlaylistItems/index.js");
const fetchToken = require("./API/TokenAccessAPI/index.js");
const audioFeatures = require("./API/GetAudioFeatures/index.js");
const trackDetails = require("./API/GetTrackDetails/index.js");
const fs = require("fs");
const json2csv = require("json2csv").Parser;

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
  "4y6CdwjLOpvFKYEGXC5Dhy",
  "4KbVm88FtGdO3pGRwkCWko",
  "4CvbUpyvW31CTHxEg88N3u",
  "5gzO9tz7E6i217mNRRJMEy",
  "37i9dQZF1DX6NY8vMELUnv",
  "7BftIzAvm1YzWYUsPOI3VJ",
  "0gvYPunqkbFub7vw1j6o1C"  

  

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

const removeDuplicates = (array) => {
  return [...new Set(array)];
};

(async () => {
  try {
    let tracks = [];
    let audioFeaturesList = [];
    let audioFeaturesAll = [];
    let completedDataSet = [];
    const accessToken = await fetchToken.fetchToken();

    for (const playlistId of playlistIds) {
      const results = await fetchTracks.fetchTracksFromPlaylist(
        playlistId,
        accessToken
      );

      tracks.push(...results);
    }

    const trackIds = tracks.map((item) => item.trackId);

    const filteredTrackIds = removeDuplicates(trackIds);

    const concatedTracks = splitAndConcatArray(filteredTrackIds, 1);

    for (const trackId of concatedTracks) {
      const trackAudioFeaturesOne = await audioFeatures.fetchAudioFeatures(
        accessToken,
        trackId
      );

      const trackAudioFeaturesTwo = await trackDetails.fetchTracksDetails(
        accessToken,
        trackId
      );

      for (const trackAudioFeature of trackAudioFeaturesOne) {
        const matchingTrackDetail = trackAudioFeaturesTwo.find(
          (trackDetail) => trackDetail?.trackId === trackAudioFeature?.id
        );
        if (matchingTrackDetail) {
          const combinedObject = {
            ...trackAudioFeature,
            ...matchingTrackDetail,
          };
          audioFeaturesAll.push(combinedObject);
        }
      }
    }

    const artistData = [];
    for (const song of audioFeaturesAll) {
      const artists = song.artists;

      let index = 1;
      if (artists.length !== 1) {
        for (const artist of artists) {
          const genres = artist[0].genres;

          const genreObject = {};
          genres.forEach((genre, index) => {
            genreObject[`artist${index + 1}_genre${index + 1}`] = genre;
          });

          artistData.push({
            trackId: song?.trackId,
            [`artistId${index}`]: artist[0].artistId,
            [`artistName${index}`]: artist[0].artistName,
            [`artistPopularity${index}`]: artist[0].popularity,
            [`artistFollowers${index}`]: artist[0].followers.total,
            ...genreObject,
          });
          index++;
        }
      } else {
        const genres = artists[0][0].genres;

        const genreObject = {};
        genres.forEach((genre, index) => {
          genreObject[`artist1_genre${index + 1}`] = genre;
        });
        artistData.push({
          trackId: song?.trackId,
          [`artistId1`]: artists[0][0]?.artistId,
          [`artistName1`]: artists[0][0]?.artistName,
          [`artistPopularity1`]: artists[0][0]?.popularity,
          [`artistFollowers1`]: artists[0][0]?.followers.total,
          ...genreObject,
        });
      }
    }

    for (const track of audioFeaturesAll) {
      const artistsOfSong = [];
      for (const artist of artistData) {
        if (track?.id === artist?.trackId) {
          artistsOfSong.push(artist);
        }
      }

      const combinedObject = artistsOfSong.reduce((result, obj) => {
        const { trackId, ...rest } = obj;
        if (!result[trackId]) {
          result[trackId] = { trackId };
        }
        Object.keys(rest).forEach((key) => {
          result[trackId][key] = obj[key];
        });
        return result;
      }, {});

      const resultArray = Object.values(combinedObject);

      const combinedData = { ...track, ...resultArray[0] };
      completedDataSet.push(combinedData);

   

      // console.log(newArrayWithoutArtists);

   
    }

    const newArrayWithoutArtists = completedDataSet.map((obj) => {
      const { artists,id,uri,track_href,analysis_url, ...newObj } = obj;
      return newObj;
    });

    let maxElementCount = 0;
    let objectWithMostElements = null;

    for (const obj of newArrayWithoutArtists) {
      const elementCount = Object.keys(obj).length;
      if (elementCount > maxElementCount) {
        maxElementCount = elementCount;
        objectWithMostElements = obj;
      }
    }

    const keys = Object.keys(objectWithMostElements);

    const json2csvParser = new json2csv({  keys });
    const csv = json2csvParser.parse(newArrayWithoutArtists);

    fs.writeFile("output 2.csv", csv, (err) => {
      if (err) {
        console.error("Error writing CSV file:", err);
      } else {
        console.log("CSV file has been created successfully.");
      }
    });

    
  } catch (error) {
    console.error("Error:", error);
  }
})();
