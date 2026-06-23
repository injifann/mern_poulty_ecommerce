import mongoose from "mongoose";

const orderSchema= new mongoose.Schema({
    
    orderNumber:
    { type:String,
        required:true,
        unique:true,
        trim:true
    },
    user:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,

    },
    items:[
        { 
            product:
            {
              type:mongoose.Schema.Types.ObjectId,
              ref:"Product",
              required:true,
            },
            quantity:{
                type:Number,
                required:true,
                min:1
            },
            priceAtTimeOfOrder:{
                type:Number,
                required:true,
            }

        }
    ],
    shippingAddress:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Address",
        required:true,
    },
    totalAmount:
    {
        type:Number,
        required:true

    },

    status:
    {
        type:String,
        enum:["pending","processing","shipped","delivered","cancelled"],
        default:"pending"

    },
    paymentStatus:
    {
      type:String,
      enum:["paid","failed","pending","refunded"],
      default:"pending",
    },
    shippingFee:
    {
      type:Number,
      default:0,
    },
})

orderSchema.pre("save",async function(next){
     if(!this.orderNumber){
        this.orderNumber="ORD-" + Math.floor(Math.random()*1000);
     }
     this.calculate();
     next();
})
orderSchema.methods.calculate = function (){
    this.totalAmount=this.items.reduce((sum,item)=>sum+item.priceAtTimeOfOrder *item.quantity,0);
    this.totalAmount+=this.shippingFee;
}

const Order = mongoose.model("Order",orderSchema);