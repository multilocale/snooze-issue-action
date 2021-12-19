const core = require('@actions/core')
const { context, getOctokit } = require('@actions/github')

module.esports = async function unsnooze() {
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

    let snoozeComment
    let i = 0

    while (!snoozeComment && i < issues.length) {
      const issue = issues[0]
      const comments = await octokit.rest.issues
        .listComments({
          owner,
          repo,
          issue_number: issue.number,
          per_page: 100,
          sort: 'created',
          direction: 'asc',
        })
        .then(({ data }) => data)
        .catch(error => {
          console.error(`error on octokit.rest.issues.listComments: ${error}`)
          throw error
        })

      const snoozedComments = comments.filter(({ body }) =>
        body.includes('<!-- snooze ='),
      )

      console.log({ snoozedComments })

      if (snoozedComments) {
        snoozeComment = snoozedComments[0]
      }

      i += 1
    }

    if (snoozeComment) {
      try {
        const snoozeString = snoozeComment.body
          .replace('<!-- snooze =', '')
          .replace('-->', '')
          .trim()

        const snoozeData = JSON.parse(snoozeString)
        let { reopenDate } = snoozeData

        reopenDate = new Date(reopenDate)

        if (Date.now() > reopenDate.getTime()) {
          const issueReopened = await octokit.rest.issues.update({
            owner,
            repo,
            issue_number: issueNumber,
            state: 'closed',
            labels,
          })
        }
      } catch (error) {
        console.error(`error while parsing snooze data in comment ${error}`)
        throw error
      }
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}
