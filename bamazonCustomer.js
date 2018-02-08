var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,

  // Username
  user: 'root',

  // Password
  password: 'SQL2886Fun',
  database: 'bamazon',

  multipleStatements: true,
});

connection.connect(function(err) {
  if (err) throw err;
  showItems();
});

var userInput = null;

// Starting function to query the database for all available items
function showItems() {
  var query = 'SELECT * FROM products';
  connection.query(query, function(err, res) {
    console.log('\n---------------------------Product Selection---------------------------\n');
    for (var i = 0; i < res.length; i++) 
    {
      console.log('ID: ' + res[i].item_id + ' || Product: ' + res[i].product_name + ' || Department: ' + res[i].department_name + ' || Price (USD): ' + res[i].price);
    }
    console.log('\n-----------------------------------------------------------------------\n');
    buyItemPrompt()
      .then(function(input) {
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
          name: 'item_id',
          type: 'input',
          message: 'Please enter the ID of the product you would like to purchase.\n',
          validate: function(product) {
            if (isNaN(product) === false) {
              return true;
            }
            return false;
          }
        },
        {
        name: 'stock_quantity',
        type: 'input',
        message: 'How many units of the product would you like?\n',
        validate: function(quantity) {
          if (isNaN(quantity) === false) {
            return true;
            checkQuantity(userInput);
          }
          return false;
          }
        }
      ]
    )
  };

// Function to check the users requested quantity against the DB
function checkQuantity(userInput) {
  var item = userInput.item_id;
  var buyerQuantity = (userInput.stock_quantity);
  var queryStr = 'SELECT * FROM products WHERE ?';

    connection.query(queryStr, {
      item_id: item
    }, function(err, data) {
      if (err) {
        console.log('err')
      } else {

        var itemData = data[0];

        // If requested quantity is less than allow user to return to store or exit
        if (itemData.stock_quantity < buyerQuantity) {
          console.log('\nThe number of units you have requested is unavailable.\n');
          buyOrExit();
        }
        // If requested quantity is less than or equal to the DB quantity show the user their total and allow user to return to store or exit
        else {
          console.log('\nItem purchase is complete. Your total is: $' + itemData.price + '\n');
          upDateDB(item, (updatedQuantity = (itemData.stock_quantity - buyerQuantity)));
          buyOrExit();
        };

      };
    })
  }

// Function to update the DB
function upDateDB(updatedQuantity, id){ 
  connection.query('UPDATE products SET stock_quantity = "updatedQuantity" WHERE item_id = "id"'),
  [updatedQuantity, id.item_id],
  function (res, err) { 
    if (err) {
      throw err;
    }
    else {
      showItems();
    };
  };
}

// Function to prompt user to return to the store or exit
function buyOrExit () {
  return inquirer
  .prompt(
    [
      {
        name: 'choice',
        type: 'input',
        message: 'To return to store, enter "b". To exit, enter "q"\n',
        validate: function(choice) {
          if  (choice.toLowerCase() === "q") {
            console.log("\nThank you for shopping with us!");
            process.exit(0);
          };
          if (choice.toLowerCase() === "b") {
            showItems();
          }
        }
      }
    ])
  }