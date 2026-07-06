
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    user:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true
    },
    fullName:{
        type:String,
        required:true,
        max:[50,"full name cannot be longer than 50 character"],
    }
    ,
    addressLine1:{
        type:String,
        trim:true,
        required:true,
    },
    addressLine2:
    {
        type:String,
        trim:true,
    },
    city: 
    {
        type: String,
        required: true,
        trim: true
    },
    state: 
    {
        type: String,
        required: true,
        trim: true
    },
    postalCode:
     {
        type: String,
        required: true,
        trim: true
    },
    country: 
    {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        max:[20,"phone number cannot be more than 20 digits"],
        required: true,
        trim: true

    },
},{timestamps:true});

const Address = mongoose.model("Address",addressSchema);
export default Address
