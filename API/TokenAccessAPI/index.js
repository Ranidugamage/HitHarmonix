const request = require("request");

function fetchToken() {
  return new Promise((resolve, reject) => {
    const client_id = "0468a58959134e27b4cd81bd1d3d2af5";
    const client_secret = "6988f1ad22f5432084eaf21d4f3813cf";

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
