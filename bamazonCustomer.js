
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "SQL2886Fun",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  showItems();
});

// Starting function to query the database for all available items
function showItems(){
    var query = "SELECT * FROM products";
        connection.query(query, function(err, res){
        for (var i = 0; i < res.length; i++) {
          console.log("ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: " + res[i].price);
        }
          console.log(err);
          buyItem();

        });
    };

// function to handle posting new items up for auction
function buyItem() {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "What is the ID of the product you would like to purchase?",
        validate: function(value) {
            if (isNaN(value) === false) {
            return true;
          }
            return false;
        },
      },
      {
        name: "category",
        type: "input",
        message: "How many units of the product would you like?"
      }
    ])
  };