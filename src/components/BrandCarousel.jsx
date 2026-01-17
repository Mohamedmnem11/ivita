import { useState, useEffect } from 'react';

const BrandCarousel = ({ brands }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [perPage, setPerPage] = useState(6);

  
  useEffect(() => {
    const updatePerPage = () => {
      const width = window.innerWidth;
      if (width >= 1280) return 6; 
      if (width >= 1024) return 5; 
      if (width >= 768) return 4;  
      return 3;                    
    };

    setPerPage(updatePerPage());
    window.addEventListener('resize', () => setPerPage(updatePerPage()));
    return () => window.removeEventListener('resize', () => {});
  }, []);

  if (!brands?.length) return null;

  const totalPages = Math.ceil(brands.length / perPage);
  const currentBrands = brands.slice(currentIndex * perPage, (currentIndex + 1) * perPage);

  return (
    <div className="relative">
   
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-5 sm:gap-6">
        {currentBrands.map((brand) => {
         
          const meta = brand.meta || [];
          const arabicMeta = meta.find(m => m.lang === 'ar');
          const englishMeta = meta.find(m => m.lang === 'en');

          const name = englishMeta?.name || arabicMeta?.name || brand.slug || 'Brand';
          const img = brand.image || brand.logo || null;

          return (
            <div
              key={brand.id || brand.slug} 
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 p-5 flex flex-col items-center justify-center text-center group"
            >
              {img ? (
                <img
                  src={img}
                  alt={name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain mb-4 group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100?text=Brand';
                  }}
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-50 to-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl sm:text-2xl font-bold text-purple-400">
                    {name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors line-clamp-2 mt-2">
                {name}
              </span>
            </div>
          );
        })}
      </div>


      {totalPages > 1 && (
        <>

          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)}
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-all z-10"
            aria-label="Previous brands"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

        
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % totalPages)}
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-all z-10"
            aria-label="Next brands"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

   
          <div className="flex justify-center gap-3 mt-8">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'bg-purple-600 w-8' : 'bg-gray-300 w-2.5 hover:bg-gray-400'
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BrandCarousel;