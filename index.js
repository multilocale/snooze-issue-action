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

    console.log('octokit.issues.update', octokit.issues.update);

    console.log('github.context.issue', github.context.issue);

    const repo = github.context.repo.repo;
    const owner = github.context.repo.owner;
    const issue = github.context.payload.number;

    const result = await octokit.issues.createComment({
      repo,
      owner,
      issue_number: issue,
      body: 'body of the comment',
    });

    // const result = await octokit.issues.update(
    //   github.context.issue({
    //     state: 'closed',
    //   }),
    // );

    console.log({ result });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
