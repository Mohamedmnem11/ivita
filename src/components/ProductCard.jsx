import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import toast from 'react-hot-toast';
const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  
  const getProductName = () => {
    if (product.name) return product.name;
    if (product.title) return product.title;
    
   
    if (product.langs && Array.isArray(product.langs) && product.langs.length > 0) {
     
      const enLang = product.langs.find(lang => lang.lang === 'en');
      if (enLang?.name) return enLang.name;
      
 
      return product.langs[0]?.name || 'Unnamed Product';
    }
    
    return 'Unnamed Product';
  };

  
  const getProductImage = () => {
    
    if (product.image) return product.image;
    if (product.img) return product.img;
    if (product.thumbnail) return product.thumbnail;
    

    if (product.imgs && Array.isArray(product.imgs) && product.imgs.length > 0) {
      return product.imgs[0]?.img || null;
    }
    
    return null;
  };

  const productName = getProductName();
  const productImage = getProductImage();

  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0;

 
  const getProductSlug = () => {
    if (product.slug) return product.slug;
    
    if (product.langs && Array.isArray(product.langs) && product.langs.length > 0) {
      const enLang = product.langs.find(lang => lang.lang === 'en');
      if (enLang?.slug) return enLang.slug;
      return product.langs[0]?.slug || product.id;
    }
    
    return product.id;
  };

  const productSlug = getProductSlug();
  const productLink = productSlug ? `/product/${productSlug}` : '#';

 const handleAddToCart = (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (!product?.id) {
    toast.error('Cannot add this product');
    return;
  }

  dispatch(
  addToCart({
    image:productImage,
    name:productName,
    product_id: product.id,
    quantity: 1,
    price: product.sale_price || product.price || 0, 
  })
).unwrap()
    .then(() => {
      toast.success(`${productName} added to cart`);
    })
    .catch((err) => {
      toast.error(err?.message || 'Failed to add to cart');
    });
};


  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full">
      <Link to={productLink} className="relative overflow-hidden block">
        {productImage ? (
          <img
            src={productImage}
            alt={productName}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
            }}
          />
        ) : (
          <div className="w-full h-64 flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">No Image</span>
          </div>
        )}

        {hasDiscount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2.5 py-1 rounded-md text-sm font-bold shadow-sm">
            -{discountPercentage}%
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <Link to={productLink} className="block">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[48px] hover:text-purple-700 transition-colors">
            {productName}
          </h3>
        </Link>

        <div className="flex items-center gap-3 mb-3">
          {hasDiscount ? (
            <>
              <span className="text-xl font-bold text-purple-700">${product.sale_price}</span>
              <span className="text-sm text-gray-500 line-through">${product.price}</span>
            </>
          ) : (
            <span className="text-xl font-bold text-purple-700">
              ${product.price ?? product.sale_price ?? 'N/A'}
            </span>
          )}
        </div>

        {product.rating && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'}
                  size={16}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">{product.rating}</span>
          </div>
        )}

        <div className="mt-auto">
          {product.in_stock === false || product.stock === 0 ? (
            <span className="block text-center text-sm text-red-600 font-medium mb-3">
              Out of Stock
            </span>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <FaShoppingCart size={18} /> Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;