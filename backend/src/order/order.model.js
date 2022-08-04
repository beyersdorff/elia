
//konnte stockOrder und paymentMethod weder über import noch über require importieren, deshalb auch einfach erstellung innerhalb des objects 
//Erklärung warum: exportiere die beiden als mongoose.model, hier brauche ich sie aber als mongoose.schema

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//TODO: controller für paymentMethod und stockOrder schreiben DONE
//TODO: endpoints in riuter und index.js(might not be necessary) definieren DONE
//TODO: Änderung von Stock nach Erstellung von Order implementieren 
//TODO: endpoints der controller testen in postman 

//TODO: mit alberto shopping cart abklären DONE
//TODO: Alex checkout form fertig machen DONE
//TODO: in dashboard login customer wieder zu famrer ändern in zeile 31


//Stock order speichert auch immer den stock und product auf den es sich bezieht
const StockOrder = new Schema(
    {
        quantity: { type: Number, required: true },
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true

        },
        stock: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Stock",
            required: true
          }
    },
    { timestamps: true },
)

const PaymentMethod = new Schema(
    {
        name: { type: String, required: true },
    },
    { timestamps: true },
)

const Order = new Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },
    paymentMethod: { type: PaymentMethod, required: true },
    stockOrders: { type: [StockOrder], required: true },
    purchaseOption: { type: String, required: true },
    price: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    address: { type: String, required: true },
    additional_info: { type: String, required: true },
    zip: { type: Number, required: true },
    city: { type: String, required: true },
    shipping_first_name: { type: String, required: true },
    shipping_last_name: { type: String, required: true },
    shipping_address: { type: String, required: true },
    shipping_additionalInfo: { type: String, required: true },
    shipping_zip: { type: String, required: true },
    shipping_city: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("orders", Order);
