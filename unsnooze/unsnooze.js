const core = require('@actions/core')
const { context, getOctokit } = require('@actions/github')

async function run() {
  try {
    const githubToken = core.getInput('githubToken')

    const octokit = getOctokit(githubToken)

    const { repo, owner } = context.repo

    console.log({ repo })
    console.log({ owner })

    const issues = await octokit.rest.issues.listForRepo({
      // state: 'closed',
      // labels: 'snoozed',
    })

    console.log({ issues })
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
