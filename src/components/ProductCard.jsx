import React from 'react';

const ProductCard = ({ product, index, onAddToCart, onQuickView }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);
  };

  const getMainImage = () => {
    if (product.images && product.images.length > 0) return product.images[0];
    if (product.image && product.image !== '') return product.image;
    return 'https://placehold.co/600x400/f8fbff/003366?text=Right+Water';
  };

  return (
    <div className={`product-card fade-in-up ${product.is_out_of_stock ? 'out-of-stock-card' : ''}`} style={{ animationDelay: `${index * 0.1}s` }}>
      {product.discount && !product.is_out_of_stock && <div className="sale-badge">عرض خاص</div>}
      {product.is_out_of_stock && <div className="out-of-stock-badge">نفذت الكمية</div>}
      
      <div className="product-image-wrapper">
        <img 
          src={getMainImage()} 
          className="product-image" 
          alt={product.name} 
          loading="lazy"
        />
        {!product.image && (!product.images || product.images.length === 0) && (
          <div className="no-image-overlay">
            <span>حقوق الصورة محفوظة</span>
          </div>
        )}
        <div className="quick-view-overlay">
          <button className="btn-quick-view" onClick={onQuickView}>
            👁️ عرض سريع
          </button>
        </div>
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
          className={`btn btn-add-cart ${product.is_out_of_stock ? 'disabled' : ''}`} 
          onClick={() => {
            if (!product.is_out_of_stock) {
              onAddToCart(product);
              alert('تم إضافة المنتج للسلة بنجاح!'); 
            }
          }}
          disabled={product.is_out_of_stock}
        >
          {product.is_out_of_stock ? 'نفذت الكمية' : '🛒 أضف للسلة'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
