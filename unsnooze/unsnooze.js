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
      })

    console.log({ issues })
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
