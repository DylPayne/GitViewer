// ------------------------------------------------------------
// Imports
// ------------------------------------------------------------
const express = require('express');
const router = express.Router();
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

// ------------------------------------------------------------
// Options for fetch
// ------------------------------------------------------------
// Github
const githubOptions = {
  method: 'GET',
  headers: {
    Authentication: 'token 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',
  },
};

// Gitlab
const gitlabOptions = {
  method: 'GET',
  headers: {
    'PRIVATE-TOKEN': 'glpat-7C_TeABCmG16Pzqw9Euz',
  },
};

// ------------------------------------------------------------
// Getting search query url
// ------------------------------------------------------------
// Github
const getGithubSearchUrl = (username) => {
  const url = `https://api.github.com/search/users?q=${username}+sort:followers`;
  return url;
};

// Gitlab
const getGitlabSearchUrl = (username) => {
  const url = `https://gitlab.com/api/v4/search?scope=users&search=${username}`;
  return url;
};

// ------------------------------------------------------------
// Searching for users
// ------------------------------------------------------------
router.get('/search', async function (req, res, next) {
  const username = req.query.username;

  res.set('Access-Control-Allow-Origin', '*');

  var github;
  await fetch(getGithubSearchUrl(username), githubOptions)
    .then((res) => res.json())
    .then((json) => (github = json))
    .catch((error) => console.log(error));

  var gitlab;
  await fetch(getGitlabSearchUrl(username), gitlabOptions)
    .then((res) => res.json())
    .then((json) => (gitlab = json))
    .catch((error) => console.log(error));

  res.send({ github, gitlab });
});

// ------------------------------------------------------------
// Getting user url
// ------------------------------------------------------------
const getGithubUserUrl = (username) => {
  const url = `https://api.github.com/users/${username}`;
  return url;
};

const getGitlabUserUrl = (id) => {
  const url = `https://gitlab.com/api/v4/users/${id}`;
  return url;
};

// ------------------------------------------------------------
// Displaying user account
// ------------------------------------------------------------
router.get('/github/:username', function (req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');

  const username = req.params.username;
  fetch(getGithubUserUrl(username), githubOptions)
    .then((res) => res.json())
    .then((json) => res.send(json))
    .catch((error) => console.log(error));
});
router.get('/gitlab/:id', function (req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');

  const id = req.params.id;
  fetch(getGitlabUserUrl(id), gitlabOptions)
    .then((res) => res.json())
    .then((json) => res.send(json))
    .catch((error) => console.log(error));
});

// ------------------------------------------------------------
// Displaying user repositories
// ------------------------------------------------------------
router.get('/github/:username/repos', function (req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');

  const username = req.params.username;
  fetch(`${getGithubUserUrl(username)}/repos`, githubOptions)
    .then((res) => res.json())
    .then((json) => res.send(json))
    .catch((error) => console.log(error));
});
router.get('/gitlab/:id/repos', function (req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');

  const id = req.params.id;
  fetch(`${getGitlabUserUrl(id)}/projects`, gitlabOptions)
    .then((res) => res.json())
    .then((json) => res.send(json))
    .catch((error) => console.log(error));
});

// ------------------------------------------------------------
//
// ------------------------------------------------------------
module.exports = router;
