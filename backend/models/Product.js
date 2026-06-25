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
       index:true,
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
      type:mongoose.Schema.Types.ObjectId,
      ref:"Category",
      required:true,
      index:true,
    },

    averageRating: {
    type: Number,
    default: 0,
    },

    numReviews: {
    type: Number,
    default: 0,
    },
        

    images:[
         {
            url:{
                type:String,
                required:true,
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
 next;
})


productSchema.index({
    title:"text",
    description:"text",
    sku:"text"
})

const Product = mongoose.model("Product",productSchema);
export default Product;

