import React, { useState } from 'react';
import ProductCard from './ProductCard';
import CategoryTabs from './CategoryTabs';

const ProductCatalog = ({ products, onAddToCart }) => {
  return (
    <div className="catalog-container">
      {products.length === 0 ? (
        <div className="empty-state">
          <p>عذراً، لم يتم العثور على منتجات تطابق بحثك.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} onAddToCart={onAddToCart} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;
