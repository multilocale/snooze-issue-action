const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    // const payload = JSON.stringify(github.context.payload, undefined, 2);
    // console.log(`The event payload: ${payload}`);

    const githubToken = core.getInput('githubToken');
    const octokit = github.getOctokit(githubToken);

    console.log({ octokit });

    console.log('octokit.issues', octokit.issues);

    const repo = github.context.repo.repo;
    const owner = github.context.repo.owner;
    const issue_number = github.context.payload.number;

    const commentCreated = await octokit.rest.issues.createComment({
      repo,
      owner,
      issue_number,
      body: 'body of the comment',
    });

    console.log({ commentCreated });

    const issueClosed = await octokit.rest.issues.update({
      repo,
      owner,
      issue_number,
      state: 'closed',
    });

    console.log({ issueClosed });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
