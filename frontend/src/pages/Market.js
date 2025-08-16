import { useEffect, useState } from "react";
import toast from "react-hot-toast";


const Market = () => {

    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [alreadyinCart, setAlreadyInCart] = useState(false);

    const url = process.env.REACT_APP_BACKEND_URI + '/market/getallitems';
    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success) {
                setItems(data.data);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    }


    useEffect(() => {
        fetchItems();
    }, [])

    const backHandler = () => {
        window.history.back();
    }

    const cartHandeler = async (e) => {
        e.preventDefault();
        const itemId = e.target.getAttribute('item._id');  
        console.log("Item ID:", itemId);  
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/cart/addtocart`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },


                body: JSON.stringify({ itemId })
            });
            const data = await response.json();

            if (data.success) {
                setAlreadyInCart(true);
                toast.error("Item added to cart successfully!");
            }   else { 
                toast.error("Failed to add item to cart. Please try again.");
            }   
        } catch (error) {
            console.error("Error adding item to cart:", error);
            toast.error("An error occurred while adding the item to the cart.");
        }
    }    
    
    const [quantityNumber, setQuantityNumber] = useState(1);

    const incQuantityHandler = () => {  
        if (quantityNumber < 10) {
            setQuantityNumber(quantityNumber + 1);
        }       
    }

    const decQuantityHandler = () => {
        if (quantityNumber > 1) {
            setQuantityNumber(quantityNumber - 1);
        }
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200">
            <div className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-green-200 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={backHandler}
                            className="flex items-center text-green-700 hover:text-green-800 hover:bg-green-50 px-3 py-2 rounded-lg transition-all duration-200 group"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <p className="font-medium text-sm sm:text-base">
                                Back
                            </p>
                        </button>

                        <div className="text-center flex-1">
                            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-green-800">
                                MarketPlace
                            </h1>
                            <p className="hidden sm:block text-sm md:text-base text-green-600 mt-1">
                                Explore a variety of farming products ad services
                            </p>
                        </div>

                        <div className="w-16 sm:w-20"></div> {/* Spacer for centering */}
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center">
                {loading && (
                    <div className="flex justify-center items-center py-16 sm:py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
                            <p className="text-green-600 text-lg font-medium">
                                Loading...
                            </p>
                        </div>
                    </div>
                )}
                {
                    !loading && items.length > 0 && (
                        <div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                                {items.map((item) => (
                                    <div key={item._id} className="bg-white flex flex-col justify-between shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
                                        <img src={item.imageUrl} alt={item.productName} className="w-full h-48 object-cover rounded-t-lg mb-4" />
                                        <h2 className="text-lg font-semibold text-green-800 mb-2">{item.productName}</h2>
                                        <p className="text-sm text-green-600 mb-2">{item.description}</p>
                                        <p className="text-green-700 font-bold mb-2">Price: ₹{item.price}</p>
                                        {
                                            !alreadyinCart ? 
                                            (<button className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
                                            onClick={cartHandeler}>
                                                Add To Cart
                                            </button>) : 
                                            (
                                                <div className="flex items-center justify-center gap-4 bg-white/95 shadow-lg border border-green-200  rounded-lg">
                                                    <button className="text-4xl bg-green-50 rounded-xl p-2 flex items-center justify-center"
                                                    onClick={decQuantityHandler} >-</button>
                                                    <span className="text-green-700 font-bold">{quantityNumber}</span>
                                                    <button className="text-2xl bg-green-50 rounded-xl p-2 flex justify-center items-center"
                                                    onClick={incQuantityHandler} >+</button>
                                                </div>
                                            )
                                        }
                                        <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200">
                                            Buy Now
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }
            </div>

        </div>
    );
}

export default Market;