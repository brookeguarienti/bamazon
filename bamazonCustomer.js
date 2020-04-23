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

connection.connect(function (err) {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  optionMenu();
});

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
          console.log(`Thanks for visiting Bamazon!`);
          connection.end();
          break;
      }
    });
}

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
      var query = "SELECT * FROM products WHERE ?";
      // query the database for all items available and assigning item_id column to user choice
      connection.query(query, { item_id: userResponse.itemID }, function (
        err,
        response
      ) {
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
            
            connection.end();
            // optionMenu();
          });
        }
      });
    });
}
