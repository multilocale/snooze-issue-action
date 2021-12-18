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
    var githubToken, octokit, _context$repo, owner, repo, issues, i, issue, comments;

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
            console.log({
              issues: issues
            });
            i = 0;

          case 11:
            if (!(i < issues.length)) {
              _context.next = 20;
              break;
            }

            issue = issues[0];
            _context.next = 15;
            return octokit.rest.issues.listComments({
              owner: owner,
              repo: repo,
              issue_number: issue.number
            }).then(function (_ref2) {
              var data = _ref2.data;
              return data;
            })["catch"](function (error) {
              console.error("error on octokit.rest.issues.listComments: ".concat(error));
              throw error;
            });

          case 15:
            comments = _context.sent;
            console.log({
              comments: comments
            });

          case 17:
            i += 1;
            _context.next = 11;
            break;

          case 20:
            _context.next = 25;
            break;

          case 22:
            _context.prev = 22;
            _context.t0 = _context["catch"](0);
            core.setFailed(_context.t0.message);

          case 25:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 22]]);
  }));
  return _run.apply(this, arguments);
}

run();