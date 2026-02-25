import { useState, useEffect } from 'react';
import { CATEGORIES, type Category } from '@/const/categories.const';
import { PRODUCTS_CLIENT } from '@/const/product-client.const';
import { createProductSlug } from '@/lib/slugify';
import { Link } from 'react-router-dom';

const MenuPage: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // Get active categories only
  const activeCategories: Category[] = CATEGORIES.filter(
    category => category.is_active === true && category.is_deleted === false
  );

  // Auto-select first category on load
  useEffect(() => {
    if (activeCategories.length > 0 && selectedCategoryId === null) {
      setSelectedCategoryId(activeCategories[0].id);
    }
  }, [activeCategories, selectedCategoryId]);

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
  };

  // Get filtered products
  const filteredProducts = PRODUCTS_CLIENT.filter(product => {
    if (!product.is_active) return false;
    if (!selectedCategoryId) return true;
    return product.category_id === selectedCategoryId;
  });

  const selectedCategory = activeCategories.find(cat => cat.id === selectedCategoryId);

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        {/* Left Sidebar - Starbucks Style */}
        <div className="w-95 min-h-screen bg-white border-r border-gray-200 hidden lg:block">
          <div className="p-6">
            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-200 mb-8">
              <button className="px-4 py-2 text-sm font-medium text-brown-700 border-b-2 border-amber-700 -mb-px">
                Menu
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-amber-700">
                Featured
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-amber-700">
                Previous
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-amber-700">
                Favorites
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Drinks</h3>
              {activeCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`
                    w-full text-left px-3 py-2 text-lg font-semibold transition-colors rounded
                    ${selectedCategoryId === category.id
                      ? 'text-brown-700 bg-amber-50' 
                      : 'text-gray-700 hover:text-amber-700 hover:bg-amber-50'
                    }
                  `}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Breadcrumb */}
          <div className="mb-4">
            <span className="text-gray-500 text-sm">Menu / {selectedCategory?.name || 'All'}</span>
          </div>

          {/* Category Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {selectedCategory?.name || 'All Products'}
            </h1>
            {selectedCategory?.description && (
              <p className="text-gray-600">{selectedCategory.description}</p>
            )}
          </div>

          {/* Mobile Category Selector */}
          <div className="lg:hidden mb-6">
            <select
              value={selectedCategoryId || ''}
              onChange={(e) => handleCategorySelect(Number(e.target.value))}
              className="w-full p-3 border border-gray-200 rounded-lg text-sm"
            >
              <option value="">All Categories</option>
              {activeCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Products Grid - Starbucks Style */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl text-gray-300 mb-4">☕</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500">Try selecting a different category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => {
                const productSlug = createProductSlug(product.name, product.id);
                return (
                  <Link
                    key={product.id}
                    to={`/client/products/${productSlug}`}
                    className="group text-center"
                  >
                    {/* Circular Product Image - Starbucks Style */}
                    <div className="relative mb-4">
                      <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-amber-50 border-4 border-[#5B4037] group-hover:border-amber-800 transition-colors">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    
                    {/* Product Name */}
                    <h3 className="font-semibold text-gray-900 group-hover:text-amber-800 transition-colors text-sm leading-tight">
                      {product.name}
                    </h3>
                    
                    {/* Price */}
                    <p className="text-amber-700 font-medium text-sm mt-1">
                      {product.min_price === product.max_price
                        ? `${product.min_price.toLocaleString('vi-VN')}₫`
                        : `${product.min_price.toLocaleString('vi-VN')}₫ - ${product.max_price.toLocaleString('vi-VN')}₫`
                      }
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MenuPageComponent = () => <MenuPage />;
export default MenuPageComponent;