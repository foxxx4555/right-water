import React, { useState, useEffect } from 'react';

const QuickViewModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    if (product) {
      const images = (product.images && product.images.length > 0) 
        ? product.images 
        : (product.image ? [product.image] : ['https://placehold.co/600x400/f8fbff/003366?text=No+Image']);
      setMainImage(images[0]);
    }
  }, [product]);

  if (!isOpen || !product || !mainImage) return null;

  const images = (product.images && product.images.length > 0) 
    ? product.images 
    : (product.image ? [product.image] : ['https://placehold.co/600x400/f8fbff/003366?text=No+Image']);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);
  };

  return (
    <div className="modal-overlay fade-in" onClick={onClose}>
      <div className="quick-view-modal zoom-in" onClick={e => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose}>&times;</button>
        <div className="quick-view-content">
          <div className="quick-view-gallery">
            <div className="quick-view-main-img-wrapper">
              <img src={mainImage} alt={product.name} className="quick-view-main-image" />
              {product.is_out_of_stock && (
                 <div className="out-of-stock-badge-large">نفذت الكمية</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="quick-view-thumbnails">
                {images.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`nav-thumb ${mainImage === img ? 'active' : ''}`}
                    onClick={() => setMainImage(img)}
                  >
                    <img src={img} alt={`${product.name} - thumb ${idx}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="quick-view-info">
            <div className="product-meta-tags">
              <span className="product-category">{product.category}</span>
              {product.origin && <span className="product-origin-tag">{product.origin}</span>}
            </div>
            
            <h2 className="quick-view-title">{product.name}</h2>
            
            <div className="quick-view-pricing">
              <span className="product-price">{formatCurrency(product.price)}</span>
              {product.discount && <span className="old-price">{formatCurrency(product.discount)}</span>}
            </div>
            
            <div className="quick-view-description">
              <h4>الوصف والمميزات:</h4>
              <p>{product.description || 'لا توجد تفاصيل إضافية لهذا المنتج حالياً.'}</p>
            </div>
            
            <div className="quick-view-actions">
               <button 
                  className={`btn btn-primary quick-add-btn ${product.is_out_of_stock ? 'disabled' : ''}`}
                  onClick={() => {
                     if (!product.is_out_of_stock) {
                       onAddToCart(product);
                       onClose();
                       alert('تم الإضافة إلى السلة بنجاح!');
                     }
                  }}
                  disabled={product.is_out_of_stock}
               >
                  {product.is_out_of_stock ? 'نفذت الكمية' : 'إضافة إلى السلة'}
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
