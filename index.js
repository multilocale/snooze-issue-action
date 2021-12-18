const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    // const payload = JSON.stringify(github.context.payload, undefined, 2);
    // console.log(`The event payload: ${payload}`);

    const githubToken = core.getInput('githubToken');

    console.log({ githubToken });

    const octokit = github.getOctokit(githubToken);

    const repo = github.context.repo.repo;
    const owner = github.context.repo.owner;
    const issue_number = github.context.payload.number;
    console.log('github.context.payload', github.context.payload);

    console.log({ repo });
    console.log({ owner });
    console.log({ issue_number });

    const commentCreated = await octokit.rest.issues
      .createComment({
        repo,
        owner,
        issue_number,
        body: 'body of the comment',
      })
      .then((error) => {
        console.log('error for octokit.rest.issues.createComment');
        console.log('error');
      });

    console.log({ commentCreated });

    const issueClosed = await octokit.rest.issues
      .update({
        repo,
        owner,
        issue_number,
        state: 'closed',
      })
      .then((error) => {
        console.log('error for octokit.rest.issues.update');
        console.log('error');
      });

    console.log({ issueClosed });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
