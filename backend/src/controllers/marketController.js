import MarketItem from "../models/market.model.js";

export const addItems = async (req, res) => {
    try {
        const { productName,
            description,
            imageUrl,
            price,
            category,
            quantity } = req.body;

        if (!productName, !description, !imageUrl, !price, !category, !quantity) {
            return res.status(401).json({ message: "no data found" });
        }

        const newItem = await MarketItem.create({
            productName,
            description,
            imageUrl,
            price,
            category,
            quantity
        })

        return res.status(200).json({
            success: true,
            data: newItem
        });

    } catch (error) {
        console.error("Error", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getallItems = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            data: await MarketItem.find({})
        });
    }
    catch (err) {
        console.error("Error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getItemById = async (req, res) => {
    try {
        const itemId = req.params.id;
        const item = await MarketItem.findById(itemId);
        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }
        return res.status(200).json({ success: true, data: item });
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const addtocart = async (req, res) => {
    try {
        const { itemId } = req.body;
        if (!itemId) {
            return res.status(400).json({ success: false, message: "Item ID is required" });
        }
        const item = await MarketItem.findById(itemId);
        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        const user = req.user; 
        user.cartItems.push({ itemId: item._id, quantity: 1 });
        await user.save();
        
        //  if the item already exists in the cart
        const existingCartItem = user.cartItems.find(cartItem => cartItem.itemId.toString() === itemId);
        if (existingCartItem) {
            existingCartItem.quantity += 1;
        } else {
            user.cartItems.push({ itemId, quantity: 1 });
        }
        await user.save();
        return res.status(200).json({ success: true, message: "Item added to cart successfully" });
    }
    catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}