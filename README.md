
# CommuniCraft 

A **RESTful API** for building	bridges	through	collaborative craftsmanship, using **Node.js**. 

**Base URL** `http://localhost:8080/api/`

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
- set database name and cradentials of connection in the file   'src/util/database'
- run the application

```bash
  npm start
```

- periodically you have to pull changes made by other developers to you local repo

## Notes

For development purposes the port and cradentials of database connection will    
be hard-coded in the source
- Port: 8080 
- Database connection cradentials in 'src/util/database.js' file

But when we finish development before deploying our app, we will put these
variables on .env file (environment variables) for security.  

To run the server while development use `npm start`, that is a custom command  
in package.json file uses *nodemon* package, if you make any changes to any file  
and save it, nodemon will restart the server automatically, you don't need to   
restart manualy.

For user privacy and data security we will

- implement validation on requests using (express-validator) package.
- implement authentication using JWT (jsonwebtoken) package.
- ensure to implement authorization on data, that is checking the accessibility of data to user. 
- implement password encryption using (bcryptjs) package.
- use (sequelize) ORM package to apply extra layer of validation on queries. 

**Branches**  
<pre>
main
 |__ dev   
     |___ get-users-api  
     |___ add-user-api 
     |___ add-auth-feature
</pre>

* main : deployment branch 
* dev : the main development branch where all features merged 

to add api of feature you will make another branch from dev with feature  
name and after you finish work you will pull request to review by  
other developers before merge with dev branch.

## Links

[apidog workspace](https://app.apidog.com/project/467103)
## Files Structure

![File Structure](./screenshots/file_structure.png?raw=true "File Structure")

## Authors

- [@Amro Sous](https://github.com/AmroSous)
- [@Adam Akram](https://github.com/Adamakram02)
- [@Ahmad Atallah](https://github.com/Ahmadatalla)
- [@Ibrahim Qadi](https://github.com/IbraheemQadi)

