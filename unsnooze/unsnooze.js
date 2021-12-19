const { getInput, setFailed } = require('@actions/core')
const { context, getOctokit } = require('@actions/github')

module.exports = async function unsnooze() {
  try {
    const { owner, repo } = context.repo

    console.debug('Checking if some issue can be unsnoozed')

    // console.log({ owner })
    // console.log({ repo })

    const githubToken = getInput('githubToken')

    const octokit = getOctokit(githubToken)

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

    console.debug(`Found ${issues.length} closed and snoozed issues`)

    for (let i = 0; i < issues.length; i += 1) {
      console.debug(`${i + 1}/${issues.length} issues comments checking`)

      const issue = issues[0]
      const comments = await octokit.rest.issues
        .listComments({
          owner,
          repo,
          issue_number: issue.number,
          per_page: 100,
        })
        .then(({ data }) => data)
        .catch(error => {
          console.error(`error on octokit.rest.issues.listComments: ${error}`)
          throw error
        })

      console.debug(`Issue #${issue.number} has ${comments.length}+ comments`)

      const snoozeComment = comments
        .filter(({ body }) => body.includes('<!-- snooze ='))
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )[0]

      if (snoozeComment) {
        try {
          console.debug('  Found a comment with /snooze')

          const snoozeString = snoozeComment.body
            .substring(
              snoozeComment.body.lastIndexOf('<!-- snooze =') +
                '<!-- snooze ='.length,
              snoozeComment.body.lastIndexOf('-->'),
            )
            .trim()

          const snoozeData = JSON.parse(snoozeString)
          let { reopenDate } = snoozeData

          console.debug(`  reopenDate is ${reopenDate}`)

          reopenDate = new Date(reopenDate)

          if (Date.now() > reopenDate.getTime()) {
            console.debug(
              `  The time to unsnooze issue #${issue.number} has arrived`,
            )
            const labels = issue.labels
              .map(({ name }) => name)
              .filter(label => label !== 'snoozed')

            await octokit.rest.issues.update({
              owner,
              repo,
              issue_number: issue.number,
              state: 'open',
              labels,
            })

            await octokit.rest.issues.createComment({
              owner,
              repo,
              issue_number: issue.number,
              body: 'This issue has been reopened because its snooze time has past',
            })

            console.debug(
              `  Issue #${issue.number} has been reopened because its snooze time has past`,
            )
          } else {
            console.debug(
              `  reopenDate has not yet arrived and the issue will stay closed`,
            )
          }
        } catch (error) {
          console.error(`error while parsing snooze data in comment ${error}`)
          throw error
        }
      }
    }

    console.debug(`Finished checking all ${issues.length} snoozed issues`)
  } catch (error) {
    console.error(error)
    setFailed(error.message)
  }
}
