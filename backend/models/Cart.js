import mongoose from "mongoose";


const cartSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true,
    },

    items:[
    {
        product:{
            type : mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true,
         },
         quantity:{
            type:Number,
            required:true,
            min:1,
         },

         priceAtTimeOfOrder:
         { type:Number,
            required:true,


         }
    }

    ],
    totalAmount:{
        type:Number,
        default:0,
    },
    totalItems:{
        type:Number,
        default:0,
    }
   
},{timestamps:true});
cartSchema.pre("save",async function(next){
    if(this.isModified("items"))
    {
        this.calculateTotals();
    }
    next;
})

cartSchema.methods.calculateTotals=function()
{
    this.totalItems=this.items.reduce((sum,item)=>sum +item.quantity,0 );
    this.totalAmount=this.items.reduce((sum,item)=>sum + (item.quantity *item.priceAtTimeOfOrder),0);

}
const Cart = mongoose.model("Cart",cartSchema);
export default Cart;