import Address from '../models/Address.js'
import { isValidObjectId } from '../utilities/isValidObjectId.js';
import { sendErrorResponse } from '../utilities/sendErrorResponse.js';

export const getmyaddress = async(req,res,next)=>
{
    const id = req.user._id;
    if(!isValidObjectId(id))
    {
        return sendErrorResponse(res,400,"invalid user id");
    }
    try
    {
        const address = await Address.findOne({user:id});
        if(!address)
        {
            return sendErrorResponse(res,400,"you have not added an address before . please add first");
        }
        return res.status(200).json({message:"sucessfull",address});
    }
    catch(error)
    {
        next(error)
    }
}

export const addAddress = async (req,res,next)=>
{
    const id = req.user._id;
 
    if(!isValidObjectId(id))
    {
        return sendErrorResponse(res,400,"Invalid user id");
    }

    const {fullName,addressLine1,addressLine2,city,state,postalCode,country,phone} = req.body;
     if(!fullName || !addressLine1 || !city || !postalCode || !state ||!phone || !country)
     {
        return sendErrorResponse(res,400,"provide all requiered fields");
     }
     try
     {
        const addressExist = await Address.findOne({user:id});
        if(addressExist)
        {
            return sendErrorResponse(res,400,"you have already added your address. you can only update it");
        }
        const address = await Address.create({user:id,fullName,addressLine1,addressLine2,city,state,postalCode,country,phone})
        return res.status(201).json({message:"successfully created",address})
     }
     catch(error)
     {
        next(error)
     }
}

export const updateAddress = async (req,res,next)=>
{
    const id = req.user._id;
    const {fullName,addressLine1,addressLine2,city,state,postalCode,country,phone} = req.body;
    if(!fullName &&!addressLine1 && !addressLine2 && !city &&!state && !postalCode && !country && !phone)
    {
        return sendErrorResponse(res,400,"please update your address info first");
    }

    if(!isValidObjectId(id))
    {
        return sendErrorResponse(res,400,"invalid user id");
    }
    try
    {
      let address = await Address.findOne({user:id});
      if(!address)
      {
        return sendErrorResponse(res,400,"please add your address first");
      }
      address.fullName = fullName??address.fullName;
      address.addressLine1 = addressLine1??address.addressLine1;
      address.addressLine2 = addressLine2??address.addressLine2;
      address.city = city??address.city;
      address.state = state??address.state;
      address.country = country??address.country;
      address.phone = phone??address.phone;
      
      const updatedAddress = await address.save();
      return res.status(200).json({message:"address successfully updated",address:updatedAddress});
    }
    catch(error)
    {
        next(error)

    }
}