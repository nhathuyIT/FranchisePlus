import { type Category } from '@/const/categories.const';
import CategoryItem from './CategoryItem';

interface CategoryMenuProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onCategorySelect: (categoryId: number) => void;
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({
  categories,
  selectedCategoryId,
  onCategorySelect
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
      </div>
      
      <div className="p-3 space-y-2">
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            isSelected={selectedCategoryId === category.id}
            onClick={() => onCategorySelect(category.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;
