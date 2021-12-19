const { getInput, setFailed } = require('@actions/core')
const { context, getOctokit } = require('@actions/github')

module.exports = async function snooze() {
  try {
    const { payload } = context
    const { owner, repo } = context.repo
    const issueNumber = payload.issue.number
    const commentBody = payload.comment.body.trim()

    console.debug(`New comment for issue #${issueNumber}`)

    // console.log({ owner })
    // console.log({ repo })
    // console.log({ issueNumber })
    // console.log({ commentBody })
    // console.log('payload', payload)

    const githubToken = getInput('githubToken')

    const octokit = getOctokit(githubToken)

    if (commentBody.startsWith('/snooze')) {
      console.debug('Comment starts with /snooze and should be snoozed')

      let days = 7

      const daysToParse = commentBody
        .replace('/snooze', '')
        .replace(' ', '')
        .replace('day', '')
        .replace('days', '')

      if (daysToParse) {
        try {
          days = parseInt(daysToParse, 10)
          console.debug(`Snooze time parsed is ${days} days`)
        } catch (error) {
          console.debug(
            `Snooze time default to ${days} because of error while parsing snooze time: ${error}`,
          )
        }
      }

      const reopenDate = new Date(
        Date.now() + days * 24 * 60 * 60 * 1000,
      ).toISOString()

      const hiddenHtmlComment = `<!-- snooze = ${JSON.stringify({
        reopenDate,
      })} -->`

      const snoozeComment =
        `This issue has been snoozed for ${days} days` +
        '\n' +
        `${hiddenHtmlComment}`

      await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body: snoozeComment,
      })

      console.debug(
        `Commented issue with hidden html comment: ${hiddenHtmlComment}`,
      )

      let labels = payload.issue.labels.map(({ name }) => name)

      if (!labels.includes('snoozed')) {
        labels = labels.concat('snoozed')
      }

      await octokit.rest.issues.update({
        owner,
        repo,
        issue_number: issueNumber,
        state: 'closed',
        labels,
      })

      console.debug(`Issue #${issueNumber} has been closed and labeled snoozed`)
    } else {
      console.debug('Comment does NOT start with /snooze and will be ignored')
    }
  } catch (error) {
    setFailed(error.message)
  }
}
