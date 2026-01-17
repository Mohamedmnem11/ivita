import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductsByCategory,
  clearError,
} from "../redux/slices/productsSlice";
import ProductCard from "../components/ProductCard";
import Sidebar from "../components/Sidebar";

const CategoryProducts = () => {
  const { category_slug } = useParams();
  const dispatch = useDispatch();
  const {
    products: productsData,
    loading,
    error,
  } = useSelector((state) => state.products);

  const [filters, setFilters] = useState({
    priceRange: "all",
    inStock: false,
    onSale: false,
  });

  const getProductsArray = (data) => {
    if (!data) return [];

    if (Array.isArray(data)) return data;

    if (data.products && Array.isArray(data.products)) return data.products;

    if (data.data && Array.isArray(data.data)) return data.data;

    if (data.data?.products && Array.isArray(data.data.products))
      return data.data.products;

    return [];
  };

  const products = getProductsArray(productsData);

  useEffect(() => {
    dispatch(clearError());
    if (category_slug) {
      dispatch(getProductsByCategory(category_slug));
    }
  }, [category_slug, dispatch]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (filters.inStock) {
      filtered = filtered.filter((p) => {
        if (p.in_stock === false) return false;
        if (p.stock !== undefined && p.stock !== null && p.stock <= 0)
          return false;
        return true;
      });
    }

    if (filters.onSale) {
      filtered = filtered.filter((p) => {
        return p.sale_price && p.price && p.sale_price < p.price;
      });
    }

    if (filters.priceRange !== "all") {
      const [min, max] = filters.priceRange.split("-").map(Number);
      filtered = filtered.filter((p) => {
        const price = p.sale_price || p.price || 0;
        return price >= min && (max ? price <= max : true);
      });
    }

    return filtered;
  }, [products, filters]);

  const handleRetry = () => {
    dispatch(clearError());
    if (category_slug) {
      dispatch(getProductsByCategory(category_slug));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-lg px-6">
          <div className="text-red-600 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Failed to Load Products
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const title =
    category_slug === "all"
      ? "All Products"
      : (category_slug
          ?.replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()) ?? "Category");

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0">
          <Sidebar filters={filters} setFilters={setFilters} />
        </aside>

        <main className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {title}
            </h1>
            <p className="text-gray-600">
              {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id ?? product.slug ?? Math.random()}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-20 h-20 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No products found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or check back later
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CategoryProducts;
