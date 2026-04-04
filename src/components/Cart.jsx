import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const Cart = ({ cartItems, onUpdateQuantity, onRemoveItem, onBack, clearCart }) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);
  };

  const handleConfirmOrder = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      alert('برجاء ملء جميع البيانات (الاسم، ورقم الهاتف، والعنوان) لإتمام الطلب.');
      return;
    }

    try {
      setIsSubmitting(true);
      const totalAmount = calculateTotal();
      
      // 1. Save to Database
      const { error } = await supabase.from('orders').insert([{
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_address: formData.address,
        items: cartItems,
        total_amount: totalAmount,
        status: 'pending'
      }]);

      if (error) throw error;

      // 2. Generate WhatsApp message for Representative
      let message = `طلب جديد من العميل: ${formData.name}\n`;
      message += `الهاتف: ${formData.phone}\n`;
      message += `العنوان: ${formData.address}\n\n`;
      message += `المنتجات:\n`;
      
      cartItems.forEach(item => {
        message += `- ${item.product.name} (x${item.quantity})\n`;
      });
      message += `\nالإجمالي: ${totalAmount} ج.م`;

      const whatsappNumber = '201024326713'; // رقم المندوب المؤكد
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      alert('تم تسجيل طلبك! سيتم الآن فتح واتساب المندوب للتأكيد.');
      window.open(whatsappUrl, '_blank');
      
      clearCart();
      onBack();
      
    } catch (err) {
      console.error('Error submitting order:', err);
      alert('حدث خطأ أثناء إرسال الطلب، الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty-message fade-in">
        <h2>سلة المشتريات فارغة</h2>
        <p>قم باختيار المنتجات من الكتالوج لإضافتها للسلة.</p>
        <button className="btn btn-primary" onClick={onBack}>تصفح المنتجات</button>
      </div>
    );
  }

  return (
    <div className="cart-page-container fade-in">
      <div className="cart-header-actions">
        <button className="btn btn-secondary back-btn" onClick={onBack}>
          &rarr; العودة للكتالوج
        </button>
        <h2>سلة المشتريات ({calculateTotalItems()}) منتج</h2>
      </div>

      <div className="cart-content">
        <div className="cart-items-list">
          {cartItems.map((item, index) => (
            <div key={item.product.id} className="cart-item fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="cart-item-image">
                <img src={item.product.image || 'https://via.placeholder.com/150'} alt={item.product.name} />
              </div>
              <div className="cart-item-details">
                <h3>{item.product.name}</h3>
                <div className="cart-item-meta">
                  <span>القسم: {item.product.category}</span>
                  {item.product.origin && <span>الماركة: {item.product.origin}</span>}
                </div>
                <div className="cart-item-price">السعر: {formatCurrency(item.product.price)}</div>
              </div>
              <div className="cart-item-actions">
                <div className="quantity-controls">
                  <button onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}>-</button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}>+</button>
                </div>
                <button className="remove-item-btn" onClick={() => onRemoveItem(item.product.id)}>
                  🗑️
                </button>
              </div>
              <div className="cart-item-total">
                {formatCurrency(item.product.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary fade-in">
          <h3>ملخص الطلب</h3>
          <div className="summary-row">
            <span>عدد العناصر:</span>
            <span>{calculateTotalItems()}</span>
          </div>
          <div className="summary-row total-row">
            <span>الإجمالي:</span>
            <span>{formatCurrency(calculateTotal())}</span>
          </div>
          
          {!showCheckout ? (
            <button className="btn btn-primary checkout-btn" onClick={() => setShowCheckout(true)}>
              متابعة لإتمام الطلب
            </button>
          ) : (
            <div className="checkout-form fade-in">
              <h4>بيانات توصيل الطلب</h4>
              <input 
                type="text" 
                placeholder="الاسم الثلاثي" 
                className="chic-input mb-10"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <input 
                type="tel" 
                placeholder="رقم الهاتف" 
                className="chic-input mb-10"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              <textarea
                placeholder="العنوان بالتفصيل"
                className="chic-input mb-10"
                rows="2"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              ></textarea>
              
              <button 
                className="btn btn-whatsapp checkout-btn mt-10" 
                onClick={handleConfirmOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'جاري الإرسال...' : '🛒 تأكيد الطلب (سجل وإرسال واتساب)'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
