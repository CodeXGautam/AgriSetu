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
        if (user.cartItems.some(cartItem => cartItem.itemId.toString() === itemId)) {
            return res.status(400).json({ success: false, message: "Item already exists in cart" });
        }
        user.cartItems.push({ itemId: item._id, quantity: 1 });
        await user.save();

        //  if the item already exists in the cart
        return res.status(200).json({ success: true, message: "Item added to cart successfully" });
    }
    catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const increaseCartItemQuantity = async (req, res) => {
    try {
        const { itemId } = req.body;
        if (!itemId) {
            return res.status(400).json({ success: false, message: "Item ID is required" });
        }
        const user = req.user;
        const cartItem = user.cartItems.find(item => item.itemId.toString() === itemId);
        if (!cartItem) {
            return res.status(404).json({ success: false, message: "Item not found in cart" });
        }
        if (cartItem.quantity >= 10) {
            return res.status(400).json({ success: true, message: "Maximum quantity reached" });
        }
        cartItem.quantity += 1;
        await user.save();
        return res.status(200).json({ success: true, quantity: cartItem.quantity, message: "Item quantity increased successfully" });
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const decreaseCartItemQuantity = async (req, res) => {
    try {
        const { itemId } = req.body;
        if (!itemId) {
            return res.status(400).json({ success: false, message: "Item ID is required" });
        }

        const user = req.user;
        const cartItem = user.cartItems.find(item => item.itemId.toString() === itemId);

        if (!cartItem) {
            return res.status(404).json({ success: false, message: "Item not found in cart" });
        }

        let newQuantity = 0;

        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
            newQuantity = cartItem.quantity;
        } else {
            // remove the item completely
            user.cartItems = user.cartItems.filter(item => item.itemId.toString() !== itemId);
            newQuantity = 0;
        }

        await user.save();

        return res.status(200).json({
            success: true,
            quantity: newQuantity,
            message: newQuantity > 0
                ? "Item quantity decreased successfully"
                : "Item removed from cart"
        });
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


export const removeItemFromCart = async (req, res) => {
    try {
        const { itemId } = req.body;
        if (!itemId) {
            return res.status(400).json({ success: false, message: "Item ID is required" });
        }
        const user = req.user;
        user.cartItems = user.cartItems.filter(item => item.itemId.toString() !== itemId);
        await user.save();
        return res.status(200).json({ success: true, message: "Item removed from cart successfully" });
    }
    catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
