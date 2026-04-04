import React from 'react';

const ProductCard = ({ product, index, onAddToCart }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);
  };

  return (
    <div className="product-card fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
      {product.discount && <div className="sale-badge">عرض خاص</div>}
      <div className="product-image-wrapper">
        <img 
          src={product.image && product.image !== '' ? product.image : 'https://placehold.co/600x400/f8fbff/003366?text=Right+Water'} 
          className="product-image" 
          alt={product.name} 
          loading="lazy"
        />
        {!product.image && (
          <div className="no-image-overlay">
            <span>حقوق الصورة محفوظة</span>
          </div>
        )}
      </div>
      <div className="product-info">
        <div className="product-meta-tags">
          <span className="product-category">{product.category}</span>
          {product.origin && <span className="product-origin-tag">{product.origin}</span>}
        </div>
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description || 'لا يوجد وصف متاح.'}</p>
        <div className="price-container">
          <span className="product-price">{formatCurrency(product.price)}</span>
          {product.discount && <span className="old-price">{formatCurrency(product.discount)}</span>}
        </div>
        <button 
          className="btn btn-add-cart" 
          onClick={() => {
            onAddToCart(product);
            alert('تم إضافة المنتج للسلة بنجاح!'); // تحسين للمستقبل: إشعار غير مزعج (Toast)
          }}
        >
          🛒 أضف للسلة
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
