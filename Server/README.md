# mailpop3

mailpop3 offers an MIT-licensed client library for the POP3 protocol. It is currently provides the following capabilities:

# Server

Node.js/Express REST api.
The server will run Express with NodeMailer and Pop3 client

express:        -   Allows to set up middlewares to respond to HTTP Requests. A backend framework for Node.js.
body-parser:    −   This is a node.js middleware for handling JSON, Raw, Text and URL encoded form data.
eml-format      -   A pure Node.js library for parsing and building EML files
pm2:            -   daemon process manager that will help you manage and keep your application online
pm2API:         -    https://pm2.keymetrics.io/docs/usage/pm2-api/

## Live

## Initialize the Express.js server

# Start 
npm install pm2 -g (to install the latest version)
pm2 update
pm2 reload ecosystem.config.js --env=production
# Status 
pm2 status
# Status 
pm2 plus
# Stop 
pm2 stop all
# Disconnect
pm2.disconnect()


1. Right-click in workspace -> Select deploy operation -> deploy selected folder (this will generate a .zip file in /out)
2. Commit to repo.
3. Azure -> Free Trial -> Expand ICSEmailService -> WebJobs -> Right-click -> Open in Portal -> Add WebJobs -> Upload Zip File -> Continous



     dotnet publish --configuration Release


Install Azure App Service


## Create the windows service - This will create a Windows Service called PM2
1. Install Node module
npm install -g pm2-windows-service
2. As administrator, open command line, run:
pm2-service-install -n PM2

and set the following:

? Perform environment setup (recommended)? Yes
? Set PM2_HOME? Yes
? PM2_HOME value (this path should be accessible to the service user and
should not contain any “user-context” variables [e.g. %APPDATA%]): c:\etc\.pm2\
? Set PM2_SERVICE_SCRIPTS (the list of start-up scripts for pm2)? No
? Set PM2_SERVICE_PM2_DIR (the location of the global pm2 to use with the service)? [recommended] Yes
? Specify the directory containing the pm2 version to be used by the
service C:\Users\C0690529\AppData\Roaming\npm\node_modules\pm2\index.js

## Deploy the service
Create a new web app: ics-email-server


## Azure DevOps Services
az login
az devops configure --defaults organization=https://dev.azure.com/tscanter0583 project=Email_Service
az pipelines run --name myGithubname.pipelines-java --branch pipeline --output table


## Create Console application
dotnet new console -o "EmailConsoleService"
cd EmailConsoleService
Run dotnet restore command to resolve the dependencies of the project and give you access to the required .NET Core packages that are needed to build your project
dotnet run

## View emails in browser

Make sure your local server is still running

Navigate to http://localhost:3000/api/emails and you should see the retrieved emails

## mailservers ip address is 10.191.51.238

## Tests & Demos

Demos are in `demos`.

## Retrieve all emails

A simple example of downloading all emails in a POP3 server and saving it locally in an mbox formatted file
Note: Ensure you are connected to the VPN in order to connect to westerncape government mail server 

node ./demos/retrieve-all.js --username Enatis.UserAdmin@westerncape.gov.za --password RvB80cnO --filename ./demos/allEmails.txt
New Password
node ./demos/retrieve-all.js --username Enatis.UserAdmin@westerncape.gov.za --password 8Ec91c98f3cG --filename ./demos/allEmails.txt
TRANSPORT LICENCING
node ./demos/retrieve-all.js --username transport.licensing@westerncape.gov.za --password 5Eb81c95f3cA --tls on --filename ./demos/allEmails.txt

## Retrieve a single email

Note: Ensure you are connected to the VPN
node ./demos/retrieve-single.js --username Enatis.UserAdmin@westerncape.gov.za --password 8Ec91c98f3cG --filename ./demos/singleEmail.txt

## Read emails text file

node ./demos/displayAllEmails.js

## sendEmail

node ./demos/sendEmail.js

Please note: enter a valid recipient email address in the smtp parameters:
    const param = transporter.sendMail({
        from: 'Enatis.UserAdmin@westerncape.gov.za',
        to: '<your email address>',
        subject: 'Testing Nodemailer',
        text: 'Testing Nodemailer? ',
        html: '<b>Does LAOS have a mailbox address?</b>'
    })

## RabbitMQ

Install from https://www.rabbitmq.com/install-windows.html

Note: RabbitMQ runs in the ErlangVM which is automatically installed if installing using chocolatey

Make sure that you have a RabbitMQ server running (default config assumes RabbitMQ running on localhost with default credentials) and also check the configuration options in config.json.

Make sure your local server is still running

Open your browser and navigate to http://localhost:15672/

Username:   guest
Password:   guest