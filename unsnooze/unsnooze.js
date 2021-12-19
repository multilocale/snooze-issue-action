const { getInput, setFailed } = require('@actions/core')
const { context, getOctokit } = require('@actions/github')

module.exports = async function unsnooze() {
  try {
    const githubToken = getInput('githubToken')

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
        })
        .then(({ data }) => data)
        .catch(error => {
          console.error(`error on octokit.rest.issues.listComments: ${error}`)
          throw error
        })

      const snoozeComment = comments
        .filter(({ body }) => body.includes('<!-- snooze ='))
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )[0]

      if (snoozeComment) {
        try {
          console.log({ snoozeComment })

          const snoozeString = snoozeComment.body
            .substring(
              snoozeComment.body.lastIndexOf('<!-- snooze =') +
                '<!-- snooze ='.length,
              snoozeComment.body.lastIndexOf('-->'),
            )
            .trim()

          console.log({ snoozeString })

          const snoozeData = JSON.parse(snoozeString)
          let { reopenDate } = snoozeData

          reopenDate = new Date(reopenDate)

          if (Date.now() > reopenDate.getTime()) {
            const labels = issue.labels
              .map(({ name }) => name)
              .filter(label => label !== 'snoozed')
            console.log({ labels })
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
          }
        } catch (error) {
          console.error(`error while parsing snooze data in comment ${error}`)
          throw error
        }
      }
    }
  } catch (error) {
    console.error(error)
    setFailed(error.message)
  }
}
