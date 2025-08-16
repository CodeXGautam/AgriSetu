import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function Checkout() {
    const [cartItems, setCartItems] = useState([]);
    const backend = process.env.REACT_APP_BACKEND_URI;

    const fetchUserInfo = async () => {
        try {
            const res = await fetch(`${backend}/getUser`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            const user = data.user;
            
            const userCart = user.cartItems.map((item) => ({
                _id: item.itemId,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: item.quantity,
            }));

            setCartItems(userCart);
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const incQuantityHandler = async (id) => {
        try {
            const res = await fetch(`${backend}/market/increasequantity`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemId: id }),
            });
            const data = await res.json();
            if (data.success) {
                setCartItems((prev) =>
                    prev.map((item) =>
                        item._id === id ? { ...item, quantity: data.quantity } : item
                    )
                );
            }
        } catch (err) {
            console.error("Error increasing quantity:", err);
        }
    };

    const decQuantityHandler = async (id) => {
        try {
            const res = await fetch(`${backend}/market/decreasequantity`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemId: id }),
            });
            const data = await res.json();
            if (data.success) {
                if (data.quantity > 0) {
                    setCartItems((prev) =>
                        prev.map((item) =>
                            item._id === id ? { ...item, quantity: data.quantity } : item
                        )
                    );
                } else {
                    setCartItems((prev) => prev.filter((item) => item._id !== id));
                }
            }
        } catch (err) {
            console.error("Error decreasing quantity:", err);
        }
    };

    const totalPrice = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const backHandler = () => {
        window.history.back();
    }

    return (
        <div className="bg-gradient-to-br from-green-50 via-green-100 w-[100%] min-h-screen">
            <div className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-green-200 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={backHandler}
                            className="flex items-center text-green-700 hover:text-green-800 hover:bg-green-50 px-3 py-2 rounded-lg transition-all duration-200 group"
                        >
                            <svg
                                className="w-5 h-5 sm:w-6 sm:h-6 mr-2 group-hover:-translate-x-1 transition-transform duration-200"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            <p className="font-medium text-sm sm:text-base">Back</p>
                        </button>

                        <div className="text-center flex-1 flex justify-center items-center gap-4">
                            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-green-800">
                                ShoppingCart
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 sm:p-8 max-w-6xl mx-auto">
                {cartItems.length === 0 ? (
                    <p className="text-green-600 text-center">Your cart is empty</p>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={item.image || "https://via.placeholder.com/100"}
                                            alt={item.name}
                                            className="w-24 h-24 object-cover rounded-md"
                                        />
                                        <div>
                                            <h2 className="font-semibold text-lg">{item.name}</h2>
                                            <p className="text-gray-500 text-sm">₹{item.price}</p>
                                        </div>
                                    </div>

                                    {/* Quantity controls */}
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => decQuantityHandler(item._id)}
                                            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-lg font-semibold"
                                        >
                                            -
                                        </button>
                                        <span className="px-2 min-w-[20px] text-center">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => incQuantityHandler(item._id)}
                                            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-lg font-semibold"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white p-6 rounded-lg shadow-md h-fit sticky top-20">
                            <h2 className="text-lg font-bold mb-4">Price Details</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Total Items</span>
                                    <span>{cartItems.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Price</span>
                                    <span>₹{totalPrice}</span>
                                </div>
                            </div>
                            <hr className="my-4" />
                            <div className="flex justify-between font-semibold text-base">
                                <span>Grand Total</span>
                                <span>₹{totalPrice}</span>
                            </div>
                            <button className="w-full mt-6 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
