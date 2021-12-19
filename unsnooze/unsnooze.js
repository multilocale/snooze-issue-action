const core = require('@actions/core')
const { context, getOctokit } = require('@actions/github')

async function run() {
  try {
    const githubToken = core.getInput('githubToken')

    const octokit = getOctokit(githubToken)

    const { owner, repo } = context.repo

    console.log({ owner })
    console.log({ repo })

    const issues = await octokit.rest.issues
      .listForRepo({
        owner,
        repo,
        state: 'closed',
        labels: 'snoozed',
      })
      .then(({ data }) => data)
      .catch(error => {
        console.log(`error on octokit.rest.issues.listForRepo: ${error}`)
        throw error
      })

    // console.log({ issues })

    for (let i = 0; i < issues.length; i += 1) {
      const issue = issues[0]
      const comments = await octokit.rest.issues
        .listComments({
          owner,
          repo,
          issue_number: issue.number,
          per_page: 100,
          sort: 'created',
          direction: 'desc',
        })
        .then(({ data }) => data)
        .catch(error => {
          console.error(`error on octokit.rest.issues.listComments: ${error}`)
          throw error
        })

      console.log({ comments })

      const snoozedComments = comments.filter(({ body }) =>
        body.includes('<!-- snooze ='),
      )

      console.log({ snoozedComments })
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
