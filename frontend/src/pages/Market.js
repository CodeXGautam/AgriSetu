import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react"; // cart icon

const Market = () => {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [quantities, setQuantities] = useState({});

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const url = process.env.REACT_APP_BACKEND_URI + "/market/getallitems";

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await fetch(url, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            if (data.success) {
                setItems(data.data);

                // get unique categories
                const uniqueCategories = [
                    "All",
                    ...new Set(data.data.map((item) => item.category)),
                ];
                setCategories(uniqueCategories);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const fetchUserInfo = async () => {
        try {
            const res = await fetch(process.env.REACT_APP_BACKEND_URI + '/getUser', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.json();
            const user = data.user;

            // Save both id and quantity in cartItems
            const userCart = user.cartItems.map(item => ({
                _id: item.itemId,
                quantity: item.quantity,
            }));

            setCartItems(userCart);
        } catch (error) {
            console.log("Error: ", error);
        }
    };


    useEffect(() => {
        fetchItems();
        fetchUserInfo();
    }, []);

    const backHandler = () => {
        window.history.back();
    };

    const cartHandeler = async (e, id) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/market/addtocart`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ itemId: id }),
                }
            );
            const data = await response.json();

            if (data.success) {
                setCartItems(prev => [...prev, { _id: id, quantity: 1 }]); // default 1
                toast.success("Item added to cart successfully!");
            } else {
                toast.error("Failed to add item to cart. Please try again.");
            }
        } catch (error) {
            console.error("Error adding item to cart:", error);
            toast.error("An error occurred while adding the item to the cart.");
        }
    };


    const incQuantityHandler = async (e, id) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/market/increasequantity`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ itemId: id }),
                }
            );
            const data = await response.json();
            if (data.message == "Maximum quantity reached") {
                toast.error("Maximum quantity reached for this item.");
                return;
            }

            if (data.success) {
                setCartItems(prev =>
                    prev.map(item =>
                        item._id === id ? { ...item, quantity: data.quantity } : item
                    )
                );
            }
        } catch (error) {
            console.error("Error increasing quantity:", error);
            toast.error("An error occurred while increasing the quantity.");
        }
    };


    const decQuantityHandler = async (e, id) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/market/decreasequantity`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ itemId: id }),
                }
            );
            const data = await response.json();
            if (data.success) {
                if (data.quantity > 0) {
                    // update the item quantity
                    setCartItems((prev) =>
                        prev.map((item) =>
                            item._id === id ? { ...item, quantity: data.quantity } : item
                        )
                    );
                } else {
                    // remove the item from cartItems
                    setCartItems((prev) => prev.filter((item) => item._id !== id));
                    // fetchUserInfo();
                }
            }
        } catch (error) {
            console.error("Error decreasing quantity:", error);
            toast.error("An error occurred while decreasing the quantity.");
        }
    };

    // filter logic
    const filteredItems =
        selectedCategory === "All"
            ? items
            : items.filter((item) => item.category === selectedCategory);

    return (
        <div className="max-h-screen flex bg-gradient-to-br from-green-50 via-green-100 to-green-200 overflow-hidden">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 bg-white w-64 shadow-lg z-30 transform ${isSidebarOpen ? "translate-x-0 overflow-y-auto scrollbar-thin" : "-translate-x-full "
                    } transition-transform duration-300`}
            >
                <div className="p-4 border-b border-green-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-green-700">Filters</h2>
                    {/* Sidebar toggle button for mobile */}
                    <button
                        className="flex items-center text-green-700 hover:text-green-900"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
                <div className="p-4 space-y-3">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                setSelectedCategory(cat);
                                setIsSidebarOpen(false);
                            }}
                            className={`block w-full text-left px-3 py-2 rounded-lg transition ${selectedCategory === cat
                                ? "bg-green-500 text-white"
                                : "hover:bg-green-100 text-green-700"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-25 z-20"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                ></div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-y-auto scrollbar-thin">
                {/* Header */}
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
                                    MarketPlace
                                </h1>
                            </div>

                            <div className="flex items-center justify-center gap-8">

                                <button className="text-green-700 hover:text-green-900" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                                    Filter By
                                </button>

                                <button
                                    onClick={() => navigate("/cart")}
                                    className="relative text-green-700 hover:text-green-900"
                                >
                                    <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7" />
                                    {
                                        cartItems.length > 0 && (
                                        <span className="w-4 h-4 rounded-full bg-green-500 text-white font-bold
                                    p-2 absolute -top-2 flex justify-center items-center text-xs -right-1">{cartItems.length}
                                        </span>)
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Grid */}
                <div className="flex flex-col justify-center items-center">
                    {loading && (
                        <div className="flex justify-center items-center py-16 sm:py-20">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
                                <p className="text-green-600 text-lg font-medium">Loading...</p>
                            </div>
                        </div>
                    )}
                    {!loading && filteredItems.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                            {filteredItems.map((item) => (
                                <div
                                    key={item._id}
                                    className="bg-white flex flex-col justify-between shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200"
                                >
                                    <img
                                        src={item.imageUrl}
                                        alt={item.productName}
                                        className="w-full h-48 object-cover rounded-t-lg mb-4"
                                    />
                                    <h2 className="text-lg font-semibold text-green-800 mb-2">
                                        {item.productName}
                                    </h2>
                                    <p className="text-sm text-green-600 mb-2">
                                        {item.description}
                                    </p>
                                    <p className="text-green-700 font-bold mb-2">
                                        Price: ₹{item.price}
                                    </p>
                                    {cartItems.some(ci => ci._id === item._id) ? (
                                        <div className="flex items-center justify-center gap-4 bg-white/95 shadow-lg border border-green-200  rounded-lg">
                                            <button className="text-xl bg-green-50 rounded-xl p-2 flex items-center justify-center"
                                                onClick={(e) => decQuantityHandler(e, item._id)}>-</button>
                                            <span>
                                                {cartItems.find(ci => ci._id === item._id)?.quantity || 0}
                                            </span>
                                            <button className="text-xl bg-green-50 rounded-xl p-2 flex items-center justify-center"
                                                onClick={(e) => incQuantityHandler(e, item._id)}>+</button>
                                        </div>
                                    ) : (
                                        <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
                                            onClick={(e) => cartHandeler(e, item._id)}>Add to Cart</button>
                                    )}
                                    <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200">
                                        Buy Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Market;
