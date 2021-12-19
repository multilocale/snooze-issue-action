const unsnooze = require('../unsnooze')

jest.mock('@actions/core', () => ({
  getInput: jest.fn(),
  setFailed: jest.fn(console.error),
}))

jest.mock('@actions/github', () => ({
  context: {
    repo: {
      owner: 'STUB_OWNER',
      repo: 'STUB_REPO',
    },
  },
  getOctokit: jest.fn(() => ({
    rest: {
      issues: {
        createComment: jest.fn(() =>
          Promise.resolve({
            data: {},
          }),
        ),
        listComments: jest.fn(() =>
          Promise.resolve({
            data: [
              {
                body: `<!-- snooze = ${JSON.stringify({
                  reopenDate: new Date(
                    Date.now() - 24 * 60 * 60 * 1000, // one day old
                  ).toISOString(),
                })}-->`,
              },
            ],
          }),
        ),
        listForRepo: jest.fn(() =>
          Promise.resolve({
            data: [
              {
                labels: ['snoozed'],
                number: 1,
                state: 'closed',
              },
            ],
          }),
        ),
        update: jest.fn(() =>
          Promise.resolve({
            data: {},
          }),
        ),
      },
    },
  })),
}))

describe('unsnooze action', () => {
  it('unsnooze issues', () => {
    unsnooze()
  })
})
