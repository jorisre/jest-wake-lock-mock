module.exports = {
  branches: [],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
      },
    ],
    '@semantic-release/github',
    '@semantic-release/npm',
  ],
};
