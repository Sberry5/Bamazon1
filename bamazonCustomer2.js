function checkQuantity(input) {


  var item = input.item_id;
  var quantity = input.quantity
  var queryStr = "SELECT * FROM products WHERE ?";
  var updatedQuantity =


    connection.query(queryStr, {
      item_id: item
    }, function(err, data) {
      if (err) {
        console.log("err")
      } else {

        var itemData = data[0];
        // If requested quantity is less than quantity in DB show items agaim
        if (itemData.stock_quantity < quantity) {
          console.log("The number of units you have requested is unavailable. Please select a new item or quantity");
          showItems();
        }
        // If requested quantity is less than or equal to the DB quantity
        else {
          console.log("Item purchase is complete.");
        };

      };
    })
}

var updateItemStr = "UPDATE products SET stock_quantity = ?" + (itemData.stock_quantity - input.quantity) + ' WHERE item_id = ' + input.item_id;
console.log(updateItemStr);

//  Update inventory in database
//connection.query(updateItemStr, function(err, data) {
  //   if (err) throw err;

  //  else {
  //    console.log("Stock quantity is unavailable. Please change your order.");
  //   }
})