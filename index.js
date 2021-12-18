const core = require('@actions/core')
const { context, getOctokit } = require('@actions/github')

async function run() {
  try {
    const { payload } = context
    const githubToken = core.getInput('githubToken')

    const octokit = getOctokit(githubToken)

    const repo = context.repo.repo
    const owner = context.repo.owner
    const issue_number = payload.issue.number
    const commentBody = payload.comment.body

    console.log({ repo })
    console.log({ owner })
    console.log({ issue_number })
    console.log({ commentBody })
    console.log('payload', payload)

    if (commentBody.startsWith('/snooze')) {
      let days = 7

      let daysToParse = commentBody
        .replace('/snooze', '')
        .replace(' ', '')
        .replace('day', '')
        .replace('days', '')

      if (daysToParse) {
        try {
          days = parseInt(daysToParse, 10)
        } catch (error) {
          console.log('error while parsing snooze time: ' + error)
        }
      }

      const snoozeData = new Date(
        Date.now() + days * 24 * 60 * 60 * 1000,
      ).toISOString()

      const snoozeComment =
        `This issue has been snoozed for ${days} days` +
        '\n' +
        `<!-- snooze = ${JSON.stringify(snoozeData)} -->`

      await octokit.rest.issues.createComment({
        repo,
        owner,
        issue_number,
        body: snoozeComment,
      })

      console.log({ commentCreated })

      const labels = payload.issue.labels

      if (!labels.includes('snoozed')) {
        labels = labels.concat('snoozed')
      }

      await octokit.rest.issues.update({
        repo,
        owner,
        issue_number,
        state: 'closed',
        labels,
      })

      console.log({ issueClosed })
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
