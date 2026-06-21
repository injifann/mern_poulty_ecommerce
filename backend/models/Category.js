import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name:
    {
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    slug:
    {
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    description:
     {
        type: String,
        trim:true,
        default:""
    },
    parent:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        default:null,
    },
    isActive:{
        type:Boolean,
        default:true,
    }
},{timestamps:true})

categorySchema.pre("save",async function(next){
    if(this.name && !this.slug)
    {
        this.slug=this.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    }
    next
})

const Category = mongoose.model("Category",categorySchema);
export default Category;