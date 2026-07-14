import React from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';

const SearchFilter = ({
  searchTerm, setSearchTerm,
  category, setCategory,
  status, setStatus,
  sortBy, setSortBy,
  categories
}) => {
  return (
    <div className="w-full max-w-lg relative mx-auto mb-2 md:mb-0">
      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none transition-opacity duration-300">
        <FiSearch className="text-primary/70" size={22} />
      </div>
      <input
        type="text"
        className="block w-full pl-14 pr-6 py-4 border border-border/50 rounded-full leading-5 bg-card/50 backdrop-blur-xl shadow-2xl placeholder-textSecondary text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-base md:text-lg transition-all duration-300"
        placeholder="Search for templates..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchFilter;
