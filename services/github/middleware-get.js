const service = require('./index')

/**
 * Express middleware to get the list of pull requests for a GitHub repository
 *
 * @returns {Function} An express route handler
 */
middleware = () => {
  /**
   * An express route handler to retrieve list of PRs from GitHub repo
   * @param {Object} req An express request object
   * @param {Object} res An express response object
   * @param {Function} next An express next callback function
   * @returns {Promise}
   */
  return route = async (req, res, next) => {
    const { query = {} } = req
    const { url } = query
    try {
      const pullRequests = await service.getGitHubPullRequestList(url);
      if (!pullRequests) {
        res.status(404);
        res.json({ Error: { msg: 'Unable to retrieve pull requests' } });
      } else {
        res.status(200);
        res.send(pullRequests);
      }
    } catch (e) {
      next(e)
    }
  }
}

exports.gitHubMiddlewareGetPulls = middleware;