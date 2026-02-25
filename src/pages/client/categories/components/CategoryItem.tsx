import { type Category } from '@/const/categories.const';

interface CategoryItemProps {
  category: Category;
  isSelected: boolean;
  onClick: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ 
  category, 
  isSelected, 
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-4 rounded-lg transition-all duration-200 border
        ${isSelected 
          ? 'bg-green-50 border-green-200 text-green-800 shadow-sm' 
          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
        }
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-sm">{category.name}</h3>
          {category.description && (
            <p className="text-xs text-gray-500 mt-1">
              {category.description}
            </p>
          )}
        </div>
        {isSelected && (
          <div className="w-2 h-2 bg-green-600 rounded-full" />
        )}
      </div>
    </button>
  );
};

export default CategoryItem;
