const service = require('../index');
const fetch = require('node-fetch');

jest.mock('node-fetch', () => jest.fn());

describe('service getGitHubPullRequestData()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return null when no repo url is passed in', async () => {
    const result = await service.getGitHubPullRequestData();
    expect(result).toBe(null);
  });

  test('should return the correct pull request with commits count', async () => {
    const expected = [
      {
        url: "https://api.github.com/repos/tinh2/data_structures/pulls/1",
        id: 678562440,
        commits_count: 1
      },
      {
        url: "https://api.github.com/repos/tinh2/data_structures/pulls/2",
        id: 12491239,
        commits_count: 2
      },
    ]
    const repoUrl = 'https://api.github.com/repos/example/data_structures';
    const response = Promise.resolve({
      ok: true,
      status: 200,
      json: async () => {
          return expected;
      },
     })
    fetch.mockImplementation(()=> response);

    const result = await service.getGitHubPullRequestData(repoUrl);
    // TODO: figure out how to mock mapped promises
    expect(result.length).toBe(2);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

describe('service getCommitsUrl()', () => {
  test('should return undefined not passing in pullRequest object', () => {
    const result = service.getCommitsUrl();
    expect(result).toBe(undefined);
  });

  test('should return commits url from a valid pullRequest object', () => {
    const expectedUrl = 'www.test.url'
    const pullRequest = {
      commits_url: expectedUrl
    }
    const result = service.getCommitsUrl(pullRequest);
    expect(result).toBe(expectedUrl);
  });
});

describe('service getCommitsCountFromUrl()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return null when no url is passed in', async () => {
    const result = await service.getCommitsCountFromUrl();
    expect(result).toBe(null);
  });

  test('should return the correct number of commits per commit url', async () => {
    const expectedCount = 3;
    const commitsUrl = 'http://www.example.com';
    const response = Promise.resolve({
      ok: true,
      status: 200,
      json: () => {
          return [{}, {}, {}];
      },
     })
    fetch.mockImplementation(()=> response)
    const result = await service.getCommitsCountFromUrl(commitsUrl);
    expect(result).toBe(expectedCount);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});