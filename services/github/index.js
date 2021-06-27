const fetch = require('node-fetch');
const OPTIONS = {
  method: 'GET',
  headers: {
    'User-Agent': 'nodejs',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

/**
 * Function to retrieve list of pull requests for a given repository
 *
 * @param {String} repoUrl The URL to the repository
 * @returns {Object} Returns a JSON object representing the PRs for a given repo
 */
getGitHubPullRequestList = async (repoUrl) => {
  if (!repoUrl) {
    return null;
  }
  const pullsUrl = `${repoUrl}/pulls`;
  const res = await fetch(pullsUrl, OPTIONS);
  const body = await res.json();
  return body;
}

exports.getGitHubPullRequestList = getGitHubPullRequestList;