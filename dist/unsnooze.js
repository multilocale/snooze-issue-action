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
    var githubToken, octokit, _context$repo, repo, owner, issues;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            githubToken = core.getInput('githubToken');
            octokit = getOctokit(githubToken);
            _context$repo = context.repo, repo = _context$repo.repo, owner = _context$repo.owner;
            console.log({
              repo: repo
            });
            console.log({
              owner: owner
            });
            console.log('octokit.rest.issues', octokit.rest.issues);
            _context.next = 9;
            return octokit.rest.issues.listForRepo({// state: 'closed',
              // labels: 'snoozed',
            })["catch"](function (error) {
              console.log("error on octokit.rest.issues.listForRepo: ".concat(error));
            });

          case 9:
            issues = _context.sent;
            console.log({
              issues: issues
            });
            _context.next = 16;
            break;

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](0);
            core.setFailed(_context.t0.message);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 13]]);
  }));
  return _run.apply(this, arguments);
}

run();