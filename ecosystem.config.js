module.exports = {
  apps: [
    {
      name: 'serelepe-pay',
      script: 'server.js',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}
