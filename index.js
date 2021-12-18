const core = require('@actions/core')
const github = require('@actions/github')

async function run() {
  try {
    // const payload = JSON.stringify(github.context.payload, undefined, 2);
    // console.log(`The event payload: ${payload}`);

    const githubToken = core.getInput('githubToken')

    console.log({ githubToken })

    const octokit = github.getOctokit(githubToken)

    const repo = github.context.repo.repo
    const owner = github.context.repo.owner
    const issue_number = github.context.payload.issue.number

    const commentBody = github.context.payload.comment.body

    console.log({ repo })
    console.log({ owner })
    console.log({ issue_number })
    console.log('github.context.payload')

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

      const labels = github.context.payload.issue.labels

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
