var songNameDiv = document.getElementById("songName");
var songNameDiv2 = document.getElementById("songName2");
var songImage = document.getElementById("songImage");
const clientId = "a8bf0b0fd7ee48c092792c75b493c2c3";

function changeSongName(songName) {
  songName = "&emsp;" + songName + "&emsp;";
  songNameDiv.innerHTML = songName;
  songNameDiv2.innerHTML = songName;
}

function changeImage(imageUrl) {
  songImage.src = imageUrl;
}

const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);

var forceRefresh = params.get("forceRefresh") !== "false";

function setTokensFromUrl() {
  access_token = params.get("access_token");
  refresh_token = params.get("refresh_token");
  localStorage.setItem("access_token", access_token);
  localStorage.setItem("refresh_token", refresh_token);
}

function setTokensFromStorage() {
  access_token = localStorage.getItem("access_token");
  refresh_token = localStorage.getItem("refresh_token");
}

const refreshToken = async () => {

  // refresh token that has been previously stored
  const refreshToken = localStorage.getItem("refresh_token");
  const url = "https://accounts.spotify.com/api/token";

  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId
    }),
  }
  const body = await fetch(url, payload);
  const response = await body.json();

  console.log(response);
  if (!response.ok) {
    if (access_token != params.get("access_token")) {
      setTokensFromUrl();
      refresh();
    }
    else if (forceRefresh) {
      window.location.href = "auth.html";
    }
  }

  localStorage.setItem("access_token", response.access_token);
  if (response.refresh_token) {
    localStorage.setItem("refresh_token", response.refresh_token);
  }

}

function refresh() {
  if (access_token) {
    fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
        "Authorization": "Bearer " + access_token
      }
    })
      .then(response => {
        console.log(response);
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then(data => {
        changeSongName(data.item.name);
        if (data.item.album.images.length > 0) {
          changeImage(data.item.album.images[0].url);
        } else if (data.images.length > 0) {
          changeImage(data.images[0].url);
        }
      })
      .catch(error => {
        if (error.status === 401) {
          console.log("Refreshing token...");
          refreshToken();
        }
      });
  } else if (forceRefresh) {
    window.location.href = "auth.html";
  }
}

setTokensFromStorage();
if (!access_token) {
  setTokensFromUrl();
}
refresh();
setInterval(refresh, 5000);