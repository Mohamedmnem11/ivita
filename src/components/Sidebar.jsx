import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';

const Sidebar = () => {
  const { categories } = useSelector((state) => state.products);

  // استخراج اسم الفئة بشكل ذكي (من meta أو name مباشرة)
  const getCategoryName = (category) => {
    if (!category) return 'Unknown Category';

    // لو فيه meta (زي الداتا اللي بعتها قبل كده)
    if (category.meta?.length) {
      // الأولوية للإنجليزي، وإلا عربي
      const en = category.meta.find(m => m.lang === 'en');
      const ar = category.meta.find(m => m.lang === 'ar');
      return en?.name || ar?.name || category.name || 'Unknown';
    }

    // لو مفيش meta، استخدم name مباشرة
    return category.name || category.title || 'Unknown Category';
  };

  return (
    <div className="bg-bg rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-xl font-bold mb-6 text-text border-b border-gray-200 pb-3">
        Shop by Category
      </h3>

      <div className="space-y-1">
        {categories && categories.length > 0 ? (
          categories.map((category) => {
            const name = getCategoryName(category);
            const slug = category.slug || category.id;

            return (
              <Link
                key={category.id || slug}
                to={`/category/${slug}`}
                className="group flex items-center justify-between px-4 py-3 text-text hover:bg-secondary hover:text-primary rounded-lg transition-all duration-200"
              >
                <span className="font-medium group-hover:font-semibold transition-font">
                  {name}
                </span>
                <FaChevronRight className="text-gray-400 group-hover:text-primary text-sm transform group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            );
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-text-secondary text-sm">No categories available yet</p>
            <p className="text-xs text-gray-400 mt-2">Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;