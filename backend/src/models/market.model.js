import mongoose from 'mongoose'

const marketSchema = new mongoose.Schema({
    productName:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    imageUrl:{
        type: String,
        required:true
    },
    price:{
        type: Number,
        required:true
    },
    category:{
        type: String,
        required:true
    },
    quantity:{
        type: Number,
        required:true
    }
})

const MarketItem = mongoose.model("marketItems",marketSchema);
export default MarketItem;