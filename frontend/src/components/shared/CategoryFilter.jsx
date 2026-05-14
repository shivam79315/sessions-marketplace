import { cn } from '../../lib/utils';

const CategoryFilter = ({ categories, selected, onChange }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" data-testid="category-filter">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
            "border border-[#E5E5E5] hover:border-[#1A1A1A]",
            selected === category
              ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
              : "bg-white text-[#1A1A1A]"
          )}
          data-testid={`category-${category.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;