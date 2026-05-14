import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = "Search sessions..." }) => {
  return (
    <div className="relative w-full max-w-md" data-testid="search-bar">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-[#737373]" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 bg-white rounded-full border border-[#E5E5E5] shadow-sm
                   placeholder:text-[#737373] text-[#1A1A1A] text-base
                   focus:outline-none focus:ring-2 focus:ring-[#E05934]/20 focus:border-[#E05934]
                   transition-all"
        data-testid="search-input"
      />
    </div>
  );
};

export default SearchBar;