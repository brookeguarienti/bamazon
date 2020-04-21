var mysql = require("mysql");
var inquirer = require("inquirer");
var prompt = require("prompt");

// connection to mysql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",

    // password
    password: "MG11181990",
    database: "bamazon_DB"
});

connection.connect(function (err) {
    if(err) throw err; 
    console.log(`connected as id ${connection.threadId}`);
    connection.end();
});