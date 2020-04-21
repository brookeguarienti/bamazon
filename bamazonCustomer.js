var mysql = require("mysql");
var inquirer = require("inquirer");
var prompt = require("prompt");
var Table = require("cli-table3");

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
    showAllProducts();
});

function showAllProducts(){
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res){
        if (err) throw err;
        var table = new Table({
            head: ['ID', 'Product', 'Department', 'Price', 'In Stock'],
            colWidths: [10, 30, 15, 10, 10, 15]
          });
          for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
          }
          console.log(table.toString());
    })
    connection.end();
}
