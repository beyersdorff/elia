const Order = require("./order.model");
const Product = require("../product/product.model");

// Stripe API key
const stripe = require("stripe")(
  "sk_test_51LNdgPAvkPn2HAvECeEdtSNsTLZSovTaogctWcP77r2YLB71vo0lPSGJTtR3TtSfxfK5akJV0Rzq7ev4bg2rc2j900fHsKc7TS"
);

createOrder = async (req, res) => {
  if (!req.user || req.user.role != "customer") {
    return res.status(401).json({ sucess: false, message: "Unauthorized" });
  }

  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide an Order"
    });
  }

  const order = new Order(body);

  if (!order) {
    return res.status(400).json({ success: false, error: err });
  }

  let errorThrown;
  let stripeProductList = [];
  let updatedProducts = [];

  //update stocks, i.e. subtract the quantities from each stockOrder
  //callbacks and then resolve promise, therefore no callback
  //before we never waited on promise.all() as we resolved the internal promises with the callback function 
  //await wartet bis promise resolved, kann aber auch failen, deshalb try catch block oder mit (err, x) callback -> callback wird mit ergebnis von promise aufgerufen (=x)
  await Promise.all(
    body.stockOrders.map(async element => {
      try {
        //now findOne returns a Promise that is awaited 
        const product = await Product.findOne({ _id: element.product }).clone();

        if (!product) {
          errorThrown = "Product not found";
        }

        let stockToUpdate = product.stocks.find(
          x => x._id.toString() == element.stock.toString()
        );
        stockToUpdate.available_bottles =
          stockToUpdate.available_bottles - element.quantity;

        if (stockToUpdate.available_bottles < 0) {
          errorThrown = "stock not available";
        }

        updatedProducts.push(product);

        stripeProductList.push({
          price_data: {
            currency: "eur",
            product_data: {
              name: `${product.name} - ${stockToUpdate.size} liter bottle`
            },
            unit_amount: stockToUpdate.price * 100,
            ...(body.purchaseOption === "subscription" && {
              recurring: {
                interval: "week",
                interval_count: 4
              }
            })
          },
          quantity: element.quantity
        });

      } catch(e) {
        errorThrown=e;
      }
    })
  );

  if (!order) {
    return res.status(400).json({ success: false, error: err });
  }

  if (errorThrown) {
    return res.status(500).json({ success: false, error: errorThrown });
  }

  await Promise.all(
    updatedProducts.map(async product => {
     return product.save();
    })
  )
  order
    .save()
    .then(order => {
      return stripe.checkout.sessions.create({
        line_items: stripeProductList,
        mode: body.purchaseOption,
        success_url: `http://localhost:3000/checkout/success/${order._id}`,
        cancel_url: `http://localhost:3000/cart?checkoutFailed=true&orderId=${order._id}`
      });
    })
    .then(stripeSession => {
      return res.status(201).json({
        success: true,
        id: order._id,
        message: "Order created!",
        url: stripeSession.url
      });
    })
    .catch(error => {
      console.error(error);
      return res.status(500).json({
        error,
        message: "Order not created!"
      });
    });
};


deleteOrder = async (req, res) => {
  let updatedProducts = [];
  let errorThrown;

  try {
    const order = await Order.findOne({ _id: req.params.id }).clone();
    await Promise.all(
      order.stockOrders.map(async stockOrder => {
        const product = await Product.findOne({
          _id: stockOrder.product
        }).clone();

        let stockToUpdate = await product.stocks.find(x => {
          return x._id.toString() == stockOrder.stock.toString();
        });
        stockToUpdate.available_bottles =
          stockToUpdate.available_bottles + stockOrder.quantity;
        updatedProducts.push(product);
      })
    );
  } catch (e) {
    console.error(e);
  }

  if (errorThrown) {
    return res.status(500).json({ success: false, error: errorThrown });
  }

  await Promise.all(
    updatedProducts.map(async product => {
      return product.save();
    })
  )

  await Order.findOneAndDelete({ _id: req.params.id }, (err, order) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!order) {
      return res.status(404).json({ success: false, error: `Order not found` });
    }
    return res.status(200).json({ success: true, data: order });
  })
    .clone()
    .catch(err => console.error(err));
};

getOrderById = async (req, res) => {
  await Order.findOne({ _id: req.params.id }, (err, order) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!order) {
      return res.status(404).json({ success: false, error: `Order not found` });
    }
    return res.status(200).json({ success: true, data: order });
  })
    .clone()
    .catch(err => console.error(err));
};

getOrders = async (req, res) => {
  return Order.find({}, async (err, orders) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    let selectedOrders = orders;
    if (req.user.role == "admin") {
      selectedOrders = orders;
    } else if (req.user.role == "customer") {
      selectedOrders = orders.filter(order => order.customer == req.user.id);
    } else if (req.user.role == "farmer") {
      let newSelectOrders = [];
      let counter = 0;
      while (counter < orders.length) {
        let returnValue = await containsProductOfFarmer(
          orders[counter].stockOrders,
          req
        );
        if (returnValue) newSelectOrders.push(orders[counter]);
        counter++;
      }
      selectedOrders = newSelectOrders;
      //delete all stocks that are not to not have a product of the use farmer
      selectedOrders = await deleteNonRelevantStock(selectedOrders, req);
    } else {
      console.error(`invalid user: ${req.user.role}`);
    }
    return res.status(200).json({ success: true, data: selectedOrders });
  }).clone();
};

const deleteNonRelevantStock = async (orders, req) => {
  let counter = 0;
  while (counter < orders.length) {
    let strippedStockOrders = [];
    await Promise.all(
      orders[counter].stockOrders.map(async stockOrder => {
        try {
          let product = await Product.findOne({ _id: stockOrder.product });
          if (!product) {
            console.error("Product not found");
          } else {
            if (product.farmerID == req.user.id) {
              strippedStockOrders.push(stockOrder);
            }
          }
        } catch (e) {
          console.error(e);
        }
      })
    );
    orders[counter].stockOrders = strippedStockOrders;
    counter++;
  }
  return orders;
};

const containsProductOfFarmer = async (stockOrders, req) => {
  let returnValue = false;
  await Promise.all(
    stockOrders.map(async stockOrder => {
      try {
        let product = await Product.findOne({ _id: stockOrder.product });
        if (!product) {
          console.error("Product not found");
        } else {
          if (product.farmerID == req.user.id) {
            returnValue = true;
          }
        }
      } catch (e) {
        console.error(e);
      }
    })
  );
  return returnValue;
};

module.exports = {
  createOrder,
  deleteOrder,
  getOrders,
  getOrderById
};
