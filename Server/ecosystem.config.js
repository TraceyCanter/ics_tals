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
      "repo" : "https://dev.azure.com/tscanter0583/Email_Service/_git/Email_Service",
      "ref"  : "origin/master",
      "path" : "Server",
      "post-deploy" : "pm2 startOrRestart ecosystem.config.js --env production"
    },
    "dev" : {
      "user" : "TraceyCanter",
      "host" : "212.83.163.1",
      "repo" : "https://dev.azure.com/tscanter0583/Email_Service/_git/Email_Service",
      "ref"  : "origin/master",
      "path" : "/Server",
      "post-deploy" : "pm2 startOrRestart ecosystem.config.js --env production"
    }
  }
}