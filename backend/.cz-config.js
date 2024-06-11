module.exports = {
    types: [
      { value: 'feat', name: 'feat: a new feature' },
      { value: 'fix', name: 'fix: a bug fix' },
      { value: 'chore', name: 'chore: routine chores or maintenance' },
      { value: 'docs', name: 'docs: documentation only changes' },
      { value: 'style', name: 'style: code style changes (e.g., formatting)' },
      { value: 'refactor', name: 'refactor: code changes that neither fix a bug nor add a feature' },
      { value: 'perf', name: 'perf: performance improvements' },
      { value: 'test', name: 'test: adding or modifying tests' },
      { value: 'update', name: 'update: updating code due to external dependencies' },
    ],
    allowCustomScopes: false,
    appendBranchNameToCommitMessage: true
  };
  