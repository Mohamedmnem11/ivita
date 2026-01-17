import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, getUserInfo } from '../redux/slices/authSlice';
import { getCart } from '../redux/slices/cartSlice';
import { searchProducts, clearSearchResults, getProductsByCategory } from '../redux/slices/productsSlice';
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import ivita from '../assets/images/ivita.png';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { count } = useSelector((state) => state.cart);
  const { searchResults, products, loading: searchLoading } = useSelector((state) => state.products);

  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  // Load user & cart when logged in
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUserInfo());
      dispatch(getCart());
    }
  }, [isAuthenticated, dispatch]);

  // Use search results directly from API
  const displayResults = searchResults || [];

  // Debounced search
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      dispatch(clearSearchResults());
      setShowSearchResults(false);
      return;
    }

    const timer = setTimeout(() => {
      dispatch(searchProducts(searchQuery.trim()));
      setShowSearchResults(true);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, dispatch]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setShowUserMenu(false);
    setShowMobileMenu(false);
    navigate('/login');
  };

  const handleSearchResultClick = (product) => {
    const slug = product.slug || product.id;
    if (slug) {
      navigate(`/product/${slug}`);
    }
    setSearchQuery('');
    setShowSearchResults(false);
    setShowMobileMenu(false);
    dispatch(clearSearchResults());
  };

  const handleSearchIconClick = () => {
    if (searchQuery.trim().length >= 2) {
      if (!showSearchResults) {
        dispatch(searchProducts(searchQuery.trim()));
        setShowSearchResults(true);
      }
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim().length >= 2) {
      setShowSearchResults(true);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter' && searchQuery.trim().length >= 2) {
      dispatch(searchProducts(searchQuery.trim()));
      setShowSearchResults(true);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={ivita} alt="Ivita" className="h-10 w-auto" />
          </Link>

          {/* Search Bar - Desktop */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                onKeyPress={handleSearchKeyPress}
                onFocus={() => searchQuery.trim().length >= 2 && setShowSearchResults(true)}
                placeholder="Search supplements, vitamins..."
                className="w-full pl-11 pr-5 py-2.5 bg-gray-50 border border-gray-300 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
              <button
                onClick={handleSearchIconClick}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg hover:text-purple-600 transition-colors"
                aria-label="Search"
                type="button"
              >
                <FaSearch />
              </button>

              {/* Search Results Dropdown */}
              {showSearchResults && searchQuery.trim().length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-[420px] overflow-y-auto z-50">
                  {searchLoading ? (
                    <div className="p-6 text-center text-gray-500">
                      <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      Searching...
                    </div>
                  ) : displayResults.length > 0 ? (
                    <div>
                      {displayResults.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleSearchResultClick(product)}
                          className="flex items-center gap-4 p-4 hover:bg-purple-50 cursor-pointer transition-colors duration-150 border-b last:border-b-0"
                        >
                          {/* Image */}
                          <div className="w-14 h-14 flex-shrink-0">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name || 'Product'}
                                className="w-full h-full object-cover rounded-lg border border-gray-200"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/56?text=No+Img';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                                No Img
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {product.name || 'Unnamed Product'}
                            </p>
                            <p className="text-sm text-purple-700 font-semibold">
                              ${product.sale_price || product.price || 'N/A'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      No products found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-5 md:gap-7">
            {/* Cart */}
            {isAuthenticated && (
              <Link to="/cart" className="relative text-gray-700 hover:text-purple-700 transition-colors">
                <FaShoppingCart className="text-2xl" />
                {count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                    {count}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-gray-700 hover:text-purple-700 transition-colors"
                  type="button"
                >
                  <FaUser className="text-xl" />
                  <span className="hidden md:inline text-sm font-medium">
                    {user?.first_name || user?.name || 'Account'}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
                    <div className="py-2">
                      <Link
                        to="/admin"
                        className="block px-5 py-3 text-sm text-gray-800 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Admin Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        type="button"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-flex items-center px-5 py-2 bg-purple-600 text-white text-sm font-medium rounded-full hover:bg-purple-700 transition-all shadow-sm hover:shadow-md"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden text-2xl text-gray-700 hover:text-purple-700 transition-colors"
              type="button"
            >
              {showMobileMenu ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search + Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-gray-200">
          {/* Mobile Search */}
          <div className="px-4 py-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                onKeyPress={handleSearchKeyPress}
                placeholder="Search products..."
                className="w-full pl-11 pr-5 py-3 bg-gray-50 border border-gray-300 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleSearchIconClick}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600"
                type="button"
              >
                <FaSearch />
              </button>
            </div>

            {/* Mobile Search Results */}
            {showSearchResults && searchQuery.trim().length >= 2 && (
              <div className="mt-3 bg-white border border-gray-200 rounded-xl shadow-lg max-h-[300px] overflow-y-auto">
                {searchLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="w-6 h-6 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Searching...
                  </div>
                ) : displayResults.length > 0 ? (
                  displayResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSearchResultClick(product)}
                      className="flex items-center gap-3 p-3 hover:bg-purple-50 cursor-pointer border-b last:border-b-0"
                    >
                      <div className="w-12 h-12 flex-shrink-0">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name || 'Product'}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/48?text=No+Img';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                            No Img
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name || 'Unnamed Product'}
                        </p>
                        <p className="text-sm text-purple-700 font-semibold">
                          ${product.sale_price || product.price || 'N/A'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No products found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Links */}
          {isAuthenticated && (
            <div className="px-4 pb-5 space-y-3 border-t border-gray-100 pt-4">
              <Link
                to="/admin"
                className="block py-2.5 text-gray-800 hover:text-purple-700 transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Admin Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left py-2.5 text-red-600 hover:text-red-700 transition-colors"
                type="button"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;