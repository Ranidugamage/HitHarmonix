// get all track details

const axios = require("axios");


async function getArtistDetails(accessToken, artistId){
    try{
        const response = await axios.get(
            `https://api.spotify.com/v1/artists/${artistId}`,
             {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const artistDetails = [
           { artistId: response.data?.id,
            artistName: response.data?.name,
            popularity: response.data?.popularity,
            genres: response.data?.genres,
            followers: response.data?.followers}
        ]

        return artistDetails;
    }catch(error){
        console.error("Error fetching artist details:", error.message);
        return null;
    }
}

const getAllArtistsData = async (accessToken, artists, requestInterval) => {
    const data = [];

       for(const artist of artists){
              const artistData = await getArtistDetails(accessToken, artist.id);
              data.push(artistData);


            if (requestInterval) {
                await new Promise((resolve) => setTimeout(resolve, requestInterval));
            }
        }
        return data;
}

async function  fetchTracksDetails( accessToken, trackIds) {
    try {
        const requestInterval = 1000;
        const response = await axios.get(
            `https://api.spotify.com/v1/tracks?ids=${trackIds}`,
             {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const trackDetails = await Promise.all(response.data?.tracks.map(async (item) => ({
            trackId: item?.id,
            trackName: item?.name,
            artists: await getAllArtistsData(accessToken,item?.artists,requestInterval),
            popularity: item?.popularity,
            duration_ms: item?.duration_ms
        })));
        
        if (requestInterval) {
            await new Promise((resolve) => setTimeout(resolve, requestInterval));
        }

        return trackDetails;
    }   catch (error) {
        console.error("Error fetching track details:", error.message);
        return null;
    }
}

module.exports = {
    fetchTracksDetails,
};

