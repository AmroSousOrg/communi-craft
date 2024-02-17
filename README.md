
# CommuniCraft 

A **RESTful API** for building	bridges	through	collaborative craftsmanship, using **Node.js**. 

## Installation

To install the project on your machine

- pull the repository

```bash
  git clone https://github.com/AmroSousOrg/communi-craft.git
```

- install all dependencies and packages by running  

```bash
  npm install 
```

- create MySql Database on your machine
- set database name and cradentials of connection in the file ' /util/database '
- run the application

```bash
  npm start
```
## Notes

For development purposes the port and cradentials of database connection will    
be hard-coded in the source
- Port: 8080 
- Database connection cradentials in '/util/database.js' file

But when we finish development before deploying our app, we will put these
variables on .env file (environment variables) for security.  

To run the server while development use `npm start`, that is a custom command  
in package.json file uses *nodemon* package, if you make any changes to any file  
and save it, nodemon will restart the server automatically, you don't need to   
restart manualy.

**Branches**
* main : deployment branch 
* dev : the main development branch where all features merged 

to make another api end-point you can make sub-branch from 'dev' branch, and   
after you finish it you can push it to the 'dev' branch only. 

## Links

[postman workspace](https://aswp-team.postman.co/workspace/CommuniCraft~ec8a19c9-86ca-4426-a31e-cbedbb189393)
## Files Structure

![File Structure](./screenshots/file_structure.png?raw=true "File Structure")

## Authors

- [@Amro Sous](https://github.com/AmroSous)
- [@Adam Akram](https://github.com/Adamakram02)
- [@Ahmad Atallah](https://github.com/Ahmadatalla)
- [@Ibrahim Qadi](https://github.com/IbraheemQadi)

