var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Username
  user: "root",

  // Password
  password: "SQL2886Fun",
  database: "bamazon",

  multipleStatements: true,
});

connection.connect(function(err) {
  if (err) throw err;
  //console.log("connected as id " + connection.threadId + "\n");
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
        //console.log(input);
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
          validate: function(product) {
            if (isNaN(product) === false) {
              return true;
            }
            return false;
          }
        },
        {
        name: "stock_quantity",
        type: "input",
        message: "How many units of the product would you like?",
        validate: function(quantity) {
          if (isNaN(quantity) === false) {
            return true;
            checkQuantity(userInput);
            // updateDB();
          }
          return false;
          }
        }
      ]
    )
  }

function checkQuantity(userInput) {
  console.log("values in check Quantity function");
  console.log(userInput);
  var item = userInput.item_id;
  console.log("Item ID selected");
  console.log(item);
  var buyerQuantity = (userInput.stock_quantity);
  console.log("Quantity selected by user");
  console.log(buyerQuantity);
  var queryStr = "SELECT * FROM products WHERE ?";


    connection.query(queryStr, {
      item_id: item
    }, function(err, data) {
      if (err) {
        console.log("err")
      } else {

        var itemData = data[0];

        console.log("Here is item data:");
        console.log(itemData);

        // console.log("item quantity from db:");
        // console.log(itemData.stock_quantity);
        console.log("user input quantity:") 
        console.log(quantity);

        // If requested quantity is less than quantity in DB show items agaim
        if (itemData.stock_quantity < buyerQuantity) {
          console.log("The number of units you have requested is unavailable. Please select a new item or quantity");
          showItems();
        }
        // If requested quantity is less than or equal to the DB quantity
        else {
          console.log("Item purchase is complete.");
          upDateDB(item, parseInt(itemData.stock_quantity - buyerQuantity));
        };

      };
    })
  }

      function upDateDB(id, updatedQuantity){
        console.log("data fed to Update");
        console.log(updatedQuantity);
      var updateItemStr = "UPDATE products SET stock_quantity = " + updatedQuantity.stock_quantity + ' WHERE item_id = ' + id.item_id;
      console.log(updateItemStr);

      // Update inventory in database
      connection.query(updateItemStr, function(err, data) {
          if (err) throw err;
         else {
           console.log("Stock quantity is unavailable. Please change your order.");
          }
      })
    }