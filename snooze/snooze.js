const core = require('@actions/core')
const { context, getOctokit } = require('@actions/github')

module.esports = async function snooze() {
  try {
    const { payload } = context
    const githubToken = core.getInput('githubToken')

    const octokit = getOctokit(githubToken)

    const { owner, repo } = context.repo
    const issueNumber = payload.issue.number
    const commentBody = payload.comment.body

    console.log({ owner })
    console.log({ repo })
    console.log({ issueNumber })
    console.log({ commentBody })
    console.log('payload', payload)

    if (commentBody.startsWith('/snooze')) {
      let days = 7

      const daysToParse = commentBody
        .replace('/snooze', '')
        .replace(' ', '')
        .replace('day', '')
        .replace('days', '')

      if (daysToParse) {
        try {
          days = parseInt(daysToParse, 10)
        } catch (error) {
          console.error(`error while parsing snooze time: ${error}`)
        }
      }

      const snoozeData = {
        reopenDate: new Date(
          Date.now() + days * 24 * 60 * 60 * 1000,
        ).toISOString(),
      }

      const snoozeComment =
        `This issue has been snoozed for ${days} days` +
        '\n' +
        `<!-- snooze = ${JSON.stringify(snoozeData)} -->`

      const commentCreated = await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body: snoozeComment,
      })

      console.log({ commentCreated })

      let { labels } = payload.issue

      if (!labels.includes('snoozed')) {
        labels = labels.concat('snoozed')
      }

      const issueClosed = await octokit.rest.issues.update({
        owner,
        repo,
        issue_number: issueNumber,
        state: 'closed',
        labels,
      })

      console.log({ issueClosed })
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}
