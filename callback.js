const clientId = 'a8bf0b0fd7ee48c092792c75b493c2c3';
const redirectUri = 'http://localhost:5500/callback.html';

const urlParams = new URLSearchParams(window.location.search);
let code = urlParams.get('code');

const getToken = async code => {

  // stored in the previous step
  let codeVerifier = localStorage.getItem('code_verifier');
  const url = "https://accounts.spotify.com/api/token";

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  }

  const body = await fetch(url, payload);
  const response = await body.json();

  localStorage.setItem('access_token', response.access_token);
  localStorage.setItem('refresh_token', response.refresh_token);

  window.location.href = 'index.html';
}

getToken(code);