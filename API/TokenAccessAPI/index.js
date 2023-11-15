const request = require("request");

function fetchToken() {
  return new Promise((resolve, reject) => {
    const client_id = "c06eb2e1b5ec4b58b769ea1d3488df0b";
    const client_secret = "e71d1b959ebc43f88c8270e3337d47b9";

    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      headers: {
        Authorization:
          "Basic " +
          new Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
      form: {
        grant_type: "client_credentials",
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        const token = body.access_token;
        resolve(token);
      } else {
        reject(error || (response && response.statusCode));
      }
    });
  });
}

module.exports = {
  fetchToken,
};
