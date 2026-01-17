import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCategories, getBrands, getProductsByCategory } from '../redux/slices/productsSlice';
import BrandCarousel from '../components/BrandCarousel';
import ProductCard from '../components/ProductCard';
import img from '../assets/images/Contact-a-pharmacist-and-nutritionist-for-free (1).png';
import banner1 from '../assets/images/banner1.webp';
import banner2 from '../assets/images/banner2.webp';
import banner3 from '../assets/images/banner3.webp';

const Home = () => {
  const dispatch = useDispatch();
  const { categories: categoriesData, brands: brandsData } = useSelector((state) => state.products);

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const categories = categoriesData?.categories || categoriesData || [];
  const brands = brandsData?.brands || brandsData || [];

  
  const slides = [
    { id: 1, image: banner1, title: 'Elevate Your Wellness', subtitle: 'Premium supplements • Science-backed formulas' },
    { id: 2, image: banner2, title: 'Pure & Potent Ingredients', subtitle: 'Clean • Transparent • Effective' },
    { id: 3, image: banner3, title: 'Your Health, Our Priority', subtitle: 'Trusted by thousands since 2023' },
  ];

  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([dispatch(getCategories()), dispatch(getBrands())]);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  
  useEffect(() => {
    if (!categories?.length) return;

    const fetchFeatured = async () => {
      try {
        const slug = categories[0]?.slug || categories[0]?.id;
        if (!slug) return;

        const result = await dispatch(getProductsByCategory(slug));
        const products =
          result.payload?.data?.products ||
          result.payload?.products ||
          result.payload?.data ||
          result.payload ||
          [];

        setFeaturedProducts(Array.isArray(products) ? products.slice(0, 8) : []);
      } catch (err) {
        console.error('Failed to load featured products:', err);
      }
    };

    fetchFeatured();
  }, [categories, dispatch]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl text-text font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen">
    
      <div className="relative h-[520px] sm:h-[620px] lg:h-[720px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/30 to-transparent z-10" />

            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              onError={(e) => (e.target.src = '/images/fallback-hero.jpg')}
            />

            <div className="absolute inset-0 z-20 flex items-center justify-center px-5">
              <div className="text-center text-white max-w-4xl">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-2xl mb-5">
                  {slide.title}
                </h2>
                <p className="text-lg sm:text-2xl mb-10 drop-shadow-lg opacity-95 max-w-2xl mx-auto">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}

     
        <button
          onClick={prevSlide}
          className="absolute left-5 sm:left-10 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-4 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
          aria-label="Previous slide"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-5 sm:right-10 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-4 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
          aria-label="Next slide"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

       
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                i === currentSlide ? 'bg-white scale-125 shadow-lg' : 'bg-white/60 hover:bg-white/90'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      
      <div className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-7xl mx-auto">

        {categories?.length > 0 && (
          <section className="mb-20 lg:mb-28">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text mb-4">
                Shop by Category
              </h2>
              <div className="w-24 h-1.5 bg-primary mx-auto rounded-full mb-5"></div>
              <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                Discover our wide range of health supplements and wellness products
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-6 lg:gap-8">
              {categories.map((cat) => {
                const name = cat.name || cat.Langs?.[0]?.name || 'Unknown';
                const img = cat.image || cat.Langs?.[0]?.image;
                const slug = cat.slug || cat.id;

                return (
                  <Link
                    key={cat.id || slug}
                    to={`/category/${slug}`}
                    className="group bg-bg rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden text-center border border-gray-100"
                  >
                    <div className="aspect-square overflow-hidden">
                      {img ? (
                        <img
                          src={img}
                          alt={name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center">
                          <span className="text-4xl font-bold text-primary">{name[0]}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-text group-hover:text-primary transition-colors">
                        {name}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

      
        {brands?.length > 0 && (
          <section className="mb-20 lg:mb-28">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text mb-4">
                Trusted Brands
              </h2>
              <div className="w-24 h-1.5 bg-primary mx-auto rounded-full"></div>
            </div>
            <BrandCarousel brands={brands} />
          </section>
        )}

        
        {featuredProducts.length > 0 && (
          <section>
            <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text">
                  Featured Products
                </h2>
                <div className="w-24 h-1.5 bg-primary mt-4 rounded-full"></div>
              </div>
              {categories[0] && (
                <Link
                  to={`/category/${categories[0].slug || categories[0].id}`}
                  className="text-primary hover:text-primary/80 font-semibold text-lg flex items-center gap-2 transition-colors"
                >
                  View All
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>


      <div >
         <img src={img} alt=""  />
      </div>
      {/* Final CTA */}
      <div className="bg-gradient-to-br from-primary via-purple-600 to-indigo-700 py-10 lg:py-15 mt-10 ">
        <div className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
            Ready to Start Your Wellness Journey?
          </h2>
          <p className="text-xl sm:text-2xl  opacity-95 max-w-3xl mx-auto">
            High-quality products • Expert consultations • Fast delivery
          </p>
         
          
        </div>
      </div>
    </div>
  );
};

export default Home;