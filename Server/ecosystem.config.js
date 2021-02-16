module.exports = {
  apps: [
  {
    name: "app",
    script: "./apps/app.js", "ignore_watch" : [ "./services/output" ],
    env: {
      "NODE_ENV": "development",
    },    
    env_production : {
       "NODE_ENV": "production"
    },
    instances:1,
    exec_mode: "fork"
   },
   ],
   deploy: [
    {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    },
    development : {
      "user" : "ubuntu",
      "host" : ["192.168.0.13"],
      "ref"  : "origin/master",
      "repo" : "git@github.com:Username/repository.git",
      "path" : "/var/www/my-repository",
      "post-deploy" : "npm install; grunt dist"
    },
  }
]
}
