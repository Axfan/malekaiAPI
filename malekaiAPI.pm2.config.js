module.exports = {
  apps: [
    {
      name: 'malekaiAPI',
      script: 'dist/api.js',
      watch: true,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
