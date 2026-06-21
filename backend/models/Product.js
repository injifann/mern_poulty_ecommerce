import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    title:{
     type:String,
     required:true,
     trim:true,
     
    },
    sku:
    {
       type:String,
       required:true,
       unique:true,
       uppercase:true,
       trim:true,
    },
    description: {
        type: String,
        required: true,
    },
    price:{
        type:Number,
        required:true,
        min:0,
    },
    quantity:{
        type:Number,
        required:true,
        min:0,
        default:0,
    }
    ,
    status:{
        type:String,
        enum: ["available", "out_of_stock"],
        default:"available",
    }
    ,
    category:
    {
      type:String,
      required:true,
      enum: ["Egg", "Meat", "Tool"],
    },

    rating:{
        type:Number, 
        default:0,
        min:0,
        max:5
    }
    ,

    images:[
         {
            url:{
                type:String,
            }
            ,
            publicId:{
                type:String,
                required:true,
            },
            alt:{
                type:String,
                default:"",
            },
            isPrimary:{
                type: Boolean,
                default: false,
            }
        }]
    

   

},{timestamps:true});

productSchema.pre("save", async function(next){
 this.status = this.quantity>0?"available":"out_of_stock"
})


productSchema.index({
    title:"text",
    description:"text",
})

const Product = mongoose.model("Product",productSchema);
export default Product;