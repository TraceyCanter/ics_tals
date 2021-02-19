module.exports = {
  apps: [
  {
    name: "app",
    script: "./apps/app.js", "ignore_watch" : [ "./services/output" ],
    env: {
      "NODE_ENV": "development",
    },    
    env_production : {
       "NODE_ENV": "production", 
    },
    instances:1,
    exec_mode: "fork"
   },
   ],
   "deploy" : {
    "production" : {
      "user" : "TraceyCanter",
      "host" : "212.83.163.1",
      "repo" : "https://github.com/TraceyCanter/ics_tals",
      "ref"  : "origin/master",
      "path" : "/var/www/production",
      "post-deploy" : "pm2 startOrRestart ecosystem.config.js --env production"
    },
    "dev" : {
      "user" : "TraceyCanter",
      "host" : "212.83.163.1",
      "repo" : "https://github.com/TraceyCanter/ics_tals",
      "ref"  : "origin/master",
      "path" : "/var/www/development",
      "post-deploy" : "pm2 startOrRestart ecosystem.config.js --env production"
    }
  }
}