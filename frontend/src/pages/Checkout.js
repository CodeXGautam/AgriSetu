import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function Checkout() {
    const [cartItems, setCartItems] = useState([]);
    const [cartSummary, setCartSummary] = useState({
        totalItems: 0,
        totalQuantity: 0,
        totalAmount: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const backend = process.env.REACT_APP_BACKEND_URI;

    const fetchCartDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`${backend}/market/cart-details`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });
            
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const data = await res.json();
            
            if (data.success) {
                setCartItems(data.data.cartItems);
                setCartSummary(data.data.summary);
            } else {
                throw new Error(data.message || 'Failed to fetch cart details');
            }
        } catch (error) {
            console.error("Error fetching cart details:", error);
            setError(error.message);
            toast.error("Failed to load cart items");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartDetails();
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
                        item.itemId === id ? { ...item, quantity: data.quantity } : item
                    )
                );
                // Refresh cart details to get updated totals
                fetchCartDetails();
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
                            item.itemId === id ? { ...item, quantity: data.quantity } : item
                        )
                    );
                } else {
                    setCartItems((prev) => prev.filter((item) => item.itemId !== id));
                }
                // Refresh cart details to get updated totals
                fetchCartDetails();
            }
        } catch (err) {
            console.error("Error decreasing quantity:", err);
        }
    };

    const backHandler = () => {
        window.history.back();
    }

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-green-50 via-green-100 w-[100%] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-green-700 text-lg font-medium">Loading your cart...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gradient-to-br from-green-50 via-green-100 w-[100%] min-h-screen flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-lg shadow-md">
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <h2 className="text-red-600 text-xl font-semibold mb-2">Error Loading Cart</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button 
                        onClick={fetchCartDetails}
                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
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
                                Shopping Cart
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 sm:p-8 max-w-6xl mx-auto">
                {cartItems.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🛒</div>
                        <h2 className="text-2xl font-semibold text-green-800 mb-2">Your cart is empty</h2>
                        <p className="text-green-600 mb-6">Add some items to get started!</p>
                        <button 
                            onClick={backHandler}
                            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.itemId}
                                    className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={item.imageUrl || "https://via.placeholder.com/100"}
                                            alt={item.productName}
                                            className="w-24 h-24 object-cover rounded-md"
                                            onError={(e) => {
                                                e.target.src = "https://via.placeholder.com/100";
                                            }}
                                        />
                                        <div>
                                            <h2 className="font-semibold text-lg text-gray-800">{item.productName}</h2>
                                            <p className="text-gray-500 text-sm">₹{item.price} each</p>
                                            <p className="text-green-600 text-sm font-medium">
                                                Subtotal: ₹{item.totalPrice}
                                            </p>
                                            {item.description && (
                                                <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quantity controls */}
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => decQuantityHandler(item.itemId)}
                                            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-lg font-semibold transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="px-3 py-1 min-w-[40px] text-center font-medium bg-gray-50 rounded">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => incQuantityHandler(item.itemId)}
                                            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-lg font-semibold transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white p-6 rounded-lg shadow-md h-fit sticky top-20">
                            <h2 className="text-lg font-bold mb-4 text-gray-800">Price Details</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Items</span>
                                    <span className="font-medium">{cartSummary.totalItems}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Quantity</span>
                                    <span className="font-medium">{cartSummary.totalQuantity}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">₹{cartSummary.totalAmount}</span>
                                </div>
                                <div className="flex justify-between text-green-600">
                                    <span>Delivery</span>
                                    <span className="font-medium">FREE</span>
                                </div>
                            </div>
                            <hr className="my-4" />
                            <div className="flex justify-between font-bold text-lg text-gray-800">
                                <span>Grand Total</span>
                                <span className="text-green-600">₹{cartSummary.totalAmount}</span>
                            </div>
                            <button className="w-full mt-6 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium">
                                Proceed to Checkout
                            </button>
                            <p className="text-xs text-gray-500 text-center mt-2">
                                Secure checkout with 256-bit SSL encryption
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
