const { isNil, get, size } = require('lodash');
const fetch = require('node-fetch');
const Promise = require('bluebird');

const FETCH_OPTIONS = {
  method: 'GET',
  headers: {
    'User-Agent': 'nodejs',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

const GITHUB_REPO_API_URL = 'https://api.github.com/repos';

/**
 * Retrieve list of pull requests for a given repository
 *
 * @param {String} repoUrl The URL to the repository
 * @returns {Object} Returns a JSON object representing the PRs for a given repo
 */
getGitHubPullRequestData = async (repoUrl) => {
  if (isNil(repoUrl)) {
    return null;
  }

  try {
    const fullUrl = new URL(repoUrl);
    const pathName = fullUrl.pathname;
    const pullsUrl = `${GITHUB_REPO_API_URL}${pathName}/pulls`;
    const res = await fetch(pullsUrl, FETCH_OPTIONS);
    const pullRequestList = await res.json();
    // map through each PR and fetch commit count from each commit
    return await Promise.map(pullRequestList, async (pullRequest) => {
      const commitsUrl = getCommitsUrl(pullRequest);
      if (commitsUrl) {
        const commitsCount = await getCommitsCountFromUrl(commitsUrl);
        return {
          // just a portion of the response or the whole response?
          ...pullRequest,
          commits_count: commitsCount,
        }
      }
    })
  } catch (e) {
    throw new Error('Unable to reach GitHub Api');
  }
}

/**
 *  Retrieves count of commits
 *
 * @param commitsUrl The URL for the repository's commits
 * @returns {Number} The count of commits
 */
getCommitsCountFromUrl = async (commitsUrl) => {
  if (isNil(commitsUrl)) {
    return null;
  }

  const res = await fetch(commitsUrl, FETCH_OPTIONS);
  const body = await res.json();
  return size(body);
}

/**
 * Retrieve commits url from a pull request object
 *
 * @param {Object} pullRequest The pull request object
 * @returns {String} The commits url
 */
getCommitsUrl = (pullRequest = {}) => {
  return get(pullRequest, 'commits_url', undefined);
}

module.exports = {
  getGitHubPullRequestData,
  getCommitsUrl,
  getCommitsCountFromUrl
}