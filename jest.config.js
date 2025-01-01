const { workspaces } = require('./package.json');

module.exports = {
    projects: workspaces.map((workspace) => `<rootDir>/${workspace}`),
    collectCoverage: true,
    coverageDirectory: '<rootDir>/coverage',
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
};
