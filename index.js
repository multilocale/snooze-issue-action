const core = require('@actions/core');
const github = require('@actions/github');

try {
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  // console.log(`The event payload: ${payload}`);

  const octokit = github.getOctokit(githubToken);

  console.log({octokit})

  console.log({issues: octokit.issues})

  // const { data: comments } = await octokit.issues.listComments({
  //   ...repo,
  //   issue_number: pullRequestNumber,
  // });

  // console.log(`t: ${comments}`)

} catch (error) {
  core.setFailed(error.message);
}