"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var core = require('@actions/core');

var _require = require('@actions/github'),
    context = _require.context,
    getOctokit = _require.getOctokit;

function run() {
  return _run.apply(this, arguments);
}

function _run() {
  _run = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var payload, githubToken, octokit, _context$repo, owner, repo, issueNumber, commentBody, days, daysToParse, snoozeData, snoozeComment, commentCreated, labels, issueClosed;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            payload = context.payload;
            githubToken = core.getInput('githubToken');
            octokit = getOctokit(githubToken);
            _context$repo = context.repo, owner = _context$repo.owner, repo = _context$repo.repo;
            issueNumber = payload.issue.number;
            commentBody = payload.comment.body;
            console.log({
              owner: owner
            });
            console.log({
              repo: repo
            });
            console.log({
              issueNumber: issueNumber
            });
            console.log({
              commentBody: commentBody
            });
            console.log('payload', payload);

            if (!commentBody.startsWith('/snooze')) {
              _context.next = 28;
              break;
            }

            days = 7;
            daysToParse = commentBody.replace('/snooze', '').replace(' ', '').replace('day', '').replace('days', '');

            if (daysToParse) {
              try {
                days = parseInt(daysToParse, 10);
              } catch (error) {
                console.error("error while parsing snooze time: ".concat(error));
              }
            }

            snoozeData = {
              reopenDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
            };
            snoozeComment = "This issue has been snoozed for ".concat(days, " days") + '\n' + "<!-- snooze = ".concat(JSON.stringify(snoozeData), " -->");
            _context.next = 20;
            return octokit.rest.issues.createComment({
              owner: owner,
              repo: repo,
              issue_number: issueNumber,
              body: snoozeComment
            });

          case 20:
            commentCreated = _context.sent;
            console.log({
              commentCreated: commentCreated
            });
            labels = payload.issue.labels;

            if (!labels.includes('snoozed')) {
              labels = labels.concat('snoozed');
            }

            _context.next = 26;
            return octokit.rest.issues.update({
              owner: owner,
              repo: repo,
              issue_number: issueNumber,
              state: 'closed',
              labels: labels
            });

          case 26:
            issueClosed = _context.sent;
            console.log({
              issueClosed: issueClosed
            });

          case 28:
            _context.next = 33;
            break;

          case 30:
            _context.prev = 30;
            _context.t0 = _context["catch"](0);
            core.setFailed(_context.t0.message);

          case 33:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 30]]);
  }));
  return _run.apply(this, arguments);
}

run();