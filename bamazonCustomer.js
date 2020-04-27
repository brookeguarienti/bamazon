var mysql = require("mysql");
var inquirer = require("inquirer");
var prompt = require("prompt");
var Table = require("cli-table3");
var chalk = require("chalk");

// connection to mysql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",

  // password
  password: "MG11181990",
  database: "bamazon_DB",
});

// connect to mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  optionMenu();
});

// function to grab all products from the database and display them to the screen in a table
function showAllProducts() {
  var query = "SELECT * FROM products";
  connection.query(query, function (err, res) {
    if (err) throw err;
    var greeting = chalk.magenta`\n Check out today's available products!\n`;
    console.log(greeting);

    var table = new Table({
      head: ["ID", "Product", "Department", "Price", "In Stock"],
      colWidths: [10, 30, 15, 10, 10, 15],
    });
    for (var i = 0; i < res.length; i++) {
      table.push([
        res[i].item_id,
        res[i].product_name,
        res[i].department_name,
        res[i].price,
        res[i].stock_quantity,
      ]);
    }
    console.log(table.toString());
    buyItem();
  });
}

// function to prompt user the question of making a purchase or to exit the store
function optionMenu() {
  inquirer
    .prompt({
      name: "choice",
      type: "list",
      message: "What would you like to do?",
      choices: [`Make a purchase`, `Exit`],
    })
    .then(function (response) {
      switch (response.choice) {
        case "Make a purchase":
          showAllProducts();
          break;
        case "Exit":
          console.log(chalk.green `Thanks for visiting Bamazon!`);
          connection.end();
          break;
      }
    });
}

// function to prompt user which items they would like to purchase and the quantity
function buyItem() {
  inquirer
    .prompt([
      {
        name: "itemID",
        type: "input",
        message: `\nWhich product would you like to purchase? Please enter the product ID.\n`,
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          {
            return false;
          }
        },
      },
      {
        name: "units",
        type: "input",
        message: `\n How many units would you like to buy?\n`,
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          {
            return false;
          }
        },
      },
      {
        name: "confirmation",
        type: "confirm",
        message: "Is that correct?",
        default: true,
      },
      // connect to entire table to pull and append data from specific columns
    ])
    .then(function (userResponse) {
      if(userResponse.confirmation === false){
          console.log(chalk.red `Please re-enter the item and quantity you would like to purchase. `);
          buyItem();
      } else{
      var query = "SELECT * FROM products WHERE ?";
      // query the database for all items available and assigning item_id column to user choice
      connection.query(query, { item_id: userResponse.itemID }, function (err,response){
        if (err) throw err;
        // inform customer of how many units they have purchased
        console.log(
          `\nYou have chosen: ${userResponse.units} of ${response[0].product_name} to buy.\n`
        );
        if (userResponse.units >= response[0].stock_quantity) {
          console.log("insufficient quantity");
          optionMenu();
        } else {
          console.log("order processing");
          var totalCost = userResponse.units * response[0].price;
          var updatedStock = response[0].stock_quantity - userResponse.units;
          var updateTable =
            "UPDATE products SET stock_quantity = " +
            updatedStock +
            " WHERE item_id = " +
            userResponse.itemID;
          connection.query(updateTable, function (err, response) {
            if (err) throw err;
            console.log(
              `\nThank you for your purchase. Your total comes to $${totalCost}.\n`
            );
            console.log(`\nWe look forward to seeing you soon!\n`);
            optionMenu();
            // connection.end();
          });
        }
      });
    }
    });
}
