import { useMemo } from 'react';
import { PRODUCTS_CLIENT } from "@/const/product-client.const";
import ProductCard from "./ProductCard";

interface ProductListProps {
  selectedCategoryId: number | null;
}

const ProductList: React.FC<ProductListProps> = ({ selectedCategoryId }) => {
  const filteredProducts = useMemo(() => {
    return PRODUCTS_CLIENT.filter(product => {
      // Only show active products
      if (!product.is_active) return false;
      
      // If no category selected, show all active products
      if (!selectedCategoryId) return true;
      
      // Filter by category_id
      return product.category_id === selectedCategoryId;
    });
  }, [selectedCategoryId]);

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-6xl text-gray-300 mb-4">☕</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
        <p className="text-gray-500">Try selecting a different category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
