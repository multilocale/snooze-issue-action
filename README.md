# Snooze issue for n days

comment a Github issue with **/snooze 30 days** to temporarily close it and open it again in 30 days.

## Installation

Copy these 2 workflows to the /.github/worklows folder of your repo.
1. [/.github/workflows/snooze-issue.yml](https://github.com/multilocale/snooze-issue-action/blob/main/.github/workflows/snooze-issue.yml)
2. [/.github/workflows/unsnooze-issues.yml](https://github.com/multilocale/snooze-issue-action/blob/main/.github/workflows/unsnooze-issues.yml)

## Example usage

Write the following text in a comment on an issue to snooze for 30 days.

<pre><code>/snooze 30 days</code></pre>

or simply:

<pre><code>/snooze 30</code></pre>

By default an issue will be snoozed for 7 days:

<pre><code>/snooze</code></pre>

Do not delete the bot's comment because it contains a hidden html comment with the reopening time.

## multilocale.com

Build multi-language apps has never been easier with [multilocale.com](https://www.multilocale.com)
If you liked this action please checkout our company. We focus on DX (Developer Experience) and we love to code awesome stuff.
