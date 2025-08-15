import MarketItem from "../models/market.model.js";

export const addItems = async (req, res) => {
    try {
        const { productName,
            description,
            imageUrl,
            price,
            category,
            quantity } = req.body;

        if (! productName, ! description, ! imageUrl, ! price, ! category, ! quantity) {
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

