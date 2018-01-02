var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "SQL2886Fun",
  database: "bamazon",

  multipleStatements: true,
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  showItems();
});

var userInput = null;

// Starting function to query the database for all available items
function showItems() {
  var query = "SELECT * FROM products";
  connection.query(query, function(err, res) {
    for (var i = 0; i < res.length; i++) 
    {
      console.log("ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price (USD): " + res[i].price);
    }
    console.log(err);
    buyItemPrompt()
      .then(function(input) {
        console.log("Here is the input:");
        console.log(input);
        checkQuantity(input);
      });
  });
};

// Function to show items and begin prompts
function buyItemPrompt() {
  return inquirer
    .prompt(
      [
        {
          name: "item_id",
          type: "input",
          message: "Please enter the ID of the product you would like to purchase.",
          validate: function(value) {
            //console.log(typeof(value));
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
        {
        name: "quantity",
        type: "input",
        message: "How many units of the product would you like?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
            checkQuantity();
            // updateDB();
          }
          return false;
        //How to validate?
        //console.log("Please enter a number")
          }
        }
      ]
    )
  }

function checkQuantity(promptObject) {
  console.log("values in check Quantity function");
  console.log(promptObject);
  var item = promptObject.item_id;
  var buyerQuantity = promptObject.stock_quantity;
  var queryStr = "SELECT * FROM products WHERE ?";


    connection.query(queryStr, {
      item_id: item
    }, function(err, data) {
      if (err) {
        console.log("err")
      } else {

        var itemData = data[0];


        console.log(itemData);

        console.log("item quantity from db:", itemData.quantity);
        console.log("user input quantity:", buyerQuantity);

        // If requested quantity is less than quantity in DB show items agaim
        if (itemData.stock_quantity < buyerQuantity) {
          console.log("The number of units you have requested is unavailable. Please select a new item or quantity");
          showItems();
        }
        // If requested quantity is less than or equal to the DB quantity
        else {
          console.log("Item purchase is complete.");
          upDateDB(item, itemData.quantity - buyerQuantity);
        };

      };
    })
  }

      function upDateDB(id, updatedQuantity){
      var updateItemStr = "UPDATE products SET stock_quantity = " + updatedQuantity + ' WHERE item_id = ' + id;
      console.log(updateItemStr);

      // Update inventory in database
      connection.query(updateItemStr, function(err, data) {
          if (err) throw err;
         else {
           console.log("Stock quantity is unavailable. Please change your order.");
          }
      })
    }