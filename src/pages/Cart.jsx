import { useEffect } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeCartItem, clearCart } from '../redux/slices/cartSlice';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart } from 'react-icons/fa';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items = [], total = 0, loading, error } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  // Helper functions for safe data extraction
  const getProductName = (product) => {
    if (!product) return 'Unknown Product';
    return product.name || product.title || 'Unknown Product';
  };

  const getProductImage = (product) => {
    if (!product) return null;
    return product.image || product.img || product.thumbnail || null;
  };

  const getProductPrice = (product) => {
    if (!product) return 0;
    return parseFloat(product.sale_price || product.price || 0);
  };

  const handleUpdateQuantity = async (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;

    try {
      await dispatch(updateCartItem({ product_id: productId, quantity: newQuantity })).unwrap();
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  const handleRemoveItem = async (productId) => {
    if (!window.confirm('Are you sure you want to remove this item?')) return;

    try {
      await dispatch(removeCartItem(productId)).unwrap();
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your entire cart?')) return;

    try {
      await dispatch(clearCart()).unwrap();
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    navigate('/checkout');
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error?.message || 'Failed to load cart'}</p>
          <button
            onClick={() => dispatch(getCart())}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty Cart State
  if (!items?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-5">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <svg className="w-32 h-32 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8 text-lg">Start shopping to add items to your cart</p>
          <button
            onClick={() => navigate('/')}
            className="bg-purple-600 text-white font-bold px-10 py-4 rounded-xl shadow-lg hover:bg-purple-700 transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Cart with items
  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Your Shopping Cart</h1>
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2 transition-colors"
          >
            <FaTrash size={16} />
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => {
              const product = item.product || item;
              const name = getProductName(product);
              const image = getProductImage(product);
              const price = getProductPrice(product);
              const quantity = parseInt(item.quantity || 1);
              const productId = item.product_id;

              return (
                <div
                  key={productId}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                   
                    <div className="w-full sm:w-32 h-32 flex-shrink-0">
                      {image ? (
                        <img
                          src={image}
                          alt={name}
                          className="w-full h-full object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>

                  
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {name}
                      </h3>

                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xl font-bold text-purple-700">
                          ${price.toFixed(2)}
                        </span>
                        {product.sale_price && product.price && price !== parseFloat(product.price) && (
                          <span className="text-sm text-gray-500 line-through">
                            ${parseFloat(product.price).toFixed(2)}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleUpdateQuantity(productId, quantity, -1)}
                            disabled={quantity <= 1}
                            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
                          >
                            <FaMinus size={14} />
                          </button>
                          <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(productId, quantity, 1)}
                            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <FaPlus size={14} />
                          </button>
                        </div>

                       
                        <div className="flex items-center gap-6">
                          <p className="font-medium text-gray-800">
                            ${(price * quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => handleRemoveItem(productId)}
                            className="text-red-500 hover:text-red-700 transition-colors p-2"
                          >
                            <FaTrash size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 lg:sticky lg:top-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span className="font-semibold">Calculated at checkout</span>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-purple-700">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 transition-all mb-4 shadow-md hover:shadow-lg"
              >
                {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-100 text-gray-800 font-semibold py-4 rounded-xl hover:bg-gray-200 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;