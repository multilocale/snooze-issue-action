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
    var githubToken, octokit, _context$repo, owner, repo, issues, snoozeComment, i, issue, comments, snoozedComments, snoozeString, snoozeData, reopenDate, issueReopened;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            githubToken = core.getInput('githubToken');
            octokit = getOctokit(githubToken);
            _context$repo = context.repo, owner = _context$repo.owner, repo = _context$repo.repo;
            console.log({
              owner: owner
            });
            console.log({
              repo: repo
            });
            _context.next = 8;
            return octokit.rest.issues.listForRepo({
              owner: owner,
              repo: repo,
              state: 'closed',
              labels: 'snoozed'
            }).then(function (_ref) {
              var data = _ref.data;
              return data;
            })["catch"](function (error) {
              console.log("error on octokit.rest.issues.listForRepo: ".concat(error));
              throw error;
            });

          case 8:
            issues = _context.sent;
            i = 0;

          case 10:
            if (!(!snoozeComment && i < issues.length)) {
              _context.next = 21;
              break;
            }

            issue = issues[0];
            _context.next = 14;
            return octokit.rest.issues.listComments({
              owner: owner,
              repo: repo,
              issue_number: issue.number,
              per_page: 100,
              sort: 'created',
              direction: 'asc'
            }).then(function (_ref2) {
              var data = _ref2.data;
              return data;
            })["catch"](function (error) {
              console.error("error on octokit.rest.issues.listComments: ".concat(error));
              throw error;
            });

          case 14:
            comments = _context.sent;
            snoozedComments = comments.filter(function (_ref3) {
              var body = _ref3.body;
              return body.includes('<!-- snooze =');
            });
            console.log({
              snoozedComments: snoozedComments
            });

            if (snoozedComments) {
              snoozeComment = snoozedComments[0];
            }

            i += 1;
            _context.next = 10;
            break;

          case 21:
            if (!snoozeComment) {
              _context.next = 37;
              break;
            }

            _context.prev = 22;
            snoozeString = snoozeComment.body.replace('<!-- snooze =', '').replace('-->', '').trim();
            snoozeData = JSON.parse(snoozeString);
            reopenDate = snoozeData.reopenDate;
            reopenDate = new Date(reopenDate);

            if (!(Date.now() > reopenDate.getTime())) {
              _context.next = 31;
              break;
            }

            _context.next = 30;
            return octokit.rest.issues.update({
              owner: owner,
              repo: repo,
              issue_number: issueNumber,
              state: 'closed',
              labels: labels
            });

          case 30:
            issueReopened = _context.sent;

          case 31:
            _context.next = 37;
            break;

          case 33:
            _context.prev = 33;
            _context.t0 = _context["catch"](22);
            console.error("error while parsing snooze data in comment ".concat(_context.t0));
            throw _context.t0;

          case 37:
            _context.next = 42;
            break;

          case 39:
            _context.prev = 39;
            _context.t1 = _context["catch"](0);
            core.setFailed(_context.t1.message);

          case 42:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 39], [22, 33]]);
  }));
  return _run.apply(this, arguments);
}

run();