{
  "apps" : [{
     "name" : "HTTP-API",
     "script" : "http.js"
  }],
  "deploy" : {
    // "production" is the environment name
    "production" : {
      "user" : "ubuntu",
      "host" : ["192.168.0.13"],
      "ref"  : "origin/master",
      "repo" : "git@github.com:Username/repository.git",
      "path" : "/var/www/my-repository",
      "post-deploy" : "npm install; grunt dist"
     },
  }
}