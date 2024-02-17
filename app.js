/**
 *  ComuniCraft main driver 
 * 
 *  @author __ASWP Group 
 */

// global packages 
const express = require('express');
const bodyParser = require('body-parser'); 

// our packages 


const app = express(); 

// for parsing body of request from json format to javascript object 
app.use(bodyParser.json());

// for CORS Errors 
app.use((req, res, next) => {
    // allow access from all origins  
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    // allow http methods 
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PATCH, DELETE, PUT');
    // allow http headers 
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// routers 

app.listen(8080);  // server start listening op port 8080 