
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
          console.log("ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price (USD): " + res[i].price);
        }
          console.log(err);
          buyItem();

        });
    };

// Function to show items and begin prompts
function buyItem() {
  inquirer
    .prompt([
      {
        name: "item_id",
        type: "input",
        message: "Please enter the ID of the product you would like to purchase.",
        validate: function(value) {
            if (isNaN(value) === false) {
            return true;
          }
            return false;
        },
      },
      {
        name: "quantity",
        type: "input",
        message: "How many units of the product would you like?",
        validate: function(value) {
            if (isNaN(value) === false) {
            return true;
            updateDB();
          }
            return false;
            //How to validate?
            //console.log("Please enter a number")
        },        
      },
    ]).then(function updateDB(input){


      var item = input.item_id;
      var quantity = input.quantity
      var queryStr = "SELECT * FROM products WHERE ?";

    connection.query(queryStr, {item_id: item}, function(err, data){
      if (err){
          console.log("err")
            }
      else {
        var itemData = data[0];
          }
        if(quantity <= itemData.stock_quantity){
          console.log("Item purchase is complete.");

          var updateItemStr = "UPDATE products SET stock_quantity = " +  (itemData.stock_quantity - quantity) + ' WHERE item_id = ' + item;
            }
          //Update inventory in database
          connection.query(updateItemStr, function(err, data) {
            if (err) throw err;
            console.log("Order has been placed.")
           else {
             console.log("Stock quantity is unavailable. Please change your order.");
            }
          })
        })
      }