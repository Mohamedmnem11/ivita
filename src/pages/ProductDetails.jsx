import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductBySlug,
  clearCurrentProduct,
} from "../redux/slices/productsSlice";
import { addToCart, getCart } from "../redux/slices/cartSlice";
import { FaMinus, FaPlus, FaStar, FaShoppingCart } from "react-icons/fa";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { product_slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentProduct, loading, error } = useSelector(
    (state) => state.products,
  );
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  /* ================= Helpers ================= */

  // دالة تنظيف الـ HTML tags من الوصف (ده اللي طلبته)
  const stripHtml = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const getProductName = () => {
    if (!currentProduct) return "";
    if (currentProduct.name) return currentProduct.name;
    if (currentProduct.title) return currentProduct.title;

    if (currentProduct.langs?.length) {
      const en = currentProduct.langs.find((l) => l.lang === "en");
      return en?.name || currentProduct.langs[0]?.name || "Unnamed Product";
    }
    return "Unnamed Product";
  };

  const getProductDescription = () => {
    if (!currentProduct) return "";
    if (currentProduct.description)
      return stripHtml(currentProduct.description);

    if (currentProduct.langs?.length) {
      const en = currentProduct.langs.find((l) => l.lang === "en");
      return (
        stripHtml(en?.description) ||
        stripHtml(currentProduct.langs[0]?.description) ||
        ""
      );
    }
    // تنظيف الـ HTML tags هنا
    return "";
  };

  const getProductImage = () => {
    if (!currentProduct) return null;
    if (currentProduct.image) return currentProduct.image;
    if (currentProduct.img) return currentProduct.img;
    if (currentProduct.thumbnail) return currentProduct.thumbnail;

    if (currentProduct.imgs?.length) {
      return currentProduct.imgs[0]?.img || null;
    }
    return null;
  };

  const getProductSlug = () => {
    if (!currentProduct) return "";
    if (currentProduct.slug) return currentProduct.slug;

    if (currentProduct.langs?.length) {
      const en = currentProduct.langs.find((l) => l.lang === "en");
      return en?.slug || currentProduct.langs[0]?.slug || "";
    }
    return "";
  };

  const productSlug = getProductSlug();
  const productName = getProductName();
  const productDescription = getProductDescription(); 
  const productImage = getProductImage();

  const hasDiscount =
    currentProduct?.sale_price &&
    currentProduct?.price &&
    currentProduct.sale_price < currentProduct.price;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((currentProduct.price - currentProduct.sale_price) /
          currentProduct.price) *
          100,
      )
    : 0;

  useEffect(() => {
    dispatch(clearCurrentProduct());
    if (product_slug) {
      dispatch(getProductBySlug(product_slug));
    }
    return () => dispatch(clearCurrentProduct());
  }, [product_slug, dispatch]);

  const handleQuantityChange = (type) => {
    if (type === "increment") setQuantity((q) => q + 1);
    if (type === "decrement" && quantity > 1) setQuantity((q) => q - 1);
  };

  const handleAddToCart = async () => {
    if (!currentProduct?.id) {
      toast.error("Product data not ready");
      return;
    }

    if (!isAuthenticated) {
      navigate(`/login?redirect=/product/${product_slug}`);
      return;
    }

    setAddingToCart(true);
    try {
      await dispatch(
        addToCart({
          image: productImage,
          name: productName,
          product_id: currentProduct.id,
          quantity,
          price: currentProduct.sale_price || currentProduct.price || 0,
        }),
      ).unwrap();
      dispatch(getCart());
      toast.success("Product added to cart");
    } catch (err) {
      toast.error(err?.message || "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

 
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Failed to load product
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!currentProduct) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 grid md:grid-cols-2 gap-10">
          <div className="bg-gray-100 rounded-xl overflow-hidden">
            {productImage ? (
              <img
                src={productImage}
                alt={productName}
                className="w-full h-[500px] object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-size="18" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                }}
              />
            ) : (
              <div className="h-[500px] flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-4">{productName}</h1>

              {currentProduct.rating && (
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < Math.floor(currentProduct.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                  <span className="text-sm text-gray-600">
                    {currentProduct.rating}
                  </span>
                </div>
              )}

              <div className="mb-6">
                {hasDiscount ? (
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-bold text-purple-700">
                      ${currentProduct.sale_price}
                    </span>
                    <span className="line-through text-gray-500">
                      ${currentProduct.price}
                    </span>
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                      -{discountPercentage}%
                    </span>
                  </div>
                ) : (
                  <span className="text-4xl font-bold text-purple-700">
                    ${currentProduct.price}
                  </span>
                )}
              </div>

              <div className="mb-8">
                {currentProduct.in_stock === false ? (
                  <span className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium">
                    Out of Stock
                  </span>
                ) : (
                  <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
                    In Stock
                  </span>
                )}
              </div>

              {productSlug && (
                <div className="mb-8">
                  <h3 className="text-gray-600">Slug: {productSlug}</h3>
                </div>
              )}
            </div>

            {currentProduct.in_stock !== false &&
              currentProduct.stock !== 0 && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <button
                      onClick={() => handleQuantityChange("decrement")}
                      disabled={quantity <= 1}
                      className="w-10 h-10 border rounded-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                    >
                      <FaMinus />
                    </button>

                    <span className="text-xl font-bold">{quantity}</span>

                    <button
                      onClick={() => handleQuantityChange("increment")}
                      className="w-10 h-10 border rounded-lg flex items-center justify-center hover:bg-gray-100"
                    >
                      <FaPlus />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className={`w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2
                    ${addingToCart ? "bg-purple-400" : "bg-purple-600 hover:bg-purple-700"}
                  `}
                  >
                    <FaShoppingCart />
                    {addingToCart ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              )}
          </div>
        </div>

        {productDescription && (
          <div className="mt-10 bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Product Description
            </h2>
            <h4 className="text-gray-700 leading-relaxed whitespace-pre-line">
              {productDescription}
            </h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
