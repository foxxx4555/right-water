import React from 'react';
import { DEFAULT_CATEGORIES } from '../constants';

const CategoryTabs = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="filter-section">
      <div className="category-scroll">
        <button
          className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => onCategoryChange('all')}
        >
          الكل
        </button>
        {DEFAULT_CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
