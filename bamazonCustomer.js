
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Ruddy2886!",
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
          console.log(err);
          console.log(res);
        });
};