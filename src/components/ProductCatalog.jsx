import React, { useState } from 'react';
import ProductCard from './ProductCard';
import CategoryTabs from './CategoryTabs';
import QuickViewModal from './QuickViewModal';

const ProductCatalog = ({ products, onAddToCart }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openQuickView = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="catalog-container">
      {products.length === 0 ? (
        <div className="empty-state">
          <p>عذراً، لم يتم العثور على منتجات تطابق بحثك.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              index={index} 
              onAddToCart={onAddToCart} 
              onQuickView={() => openQuickView(product)}
            />
          ))}
        </div>
      )}

      <QuickViewModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={onAddToCart}
      />
    </div>
  );
};

export default ProductCatalog;
