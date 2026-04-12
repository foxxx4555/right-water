import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DEFAULT_CATEGORIES, ORIGINS } from '../constants';
import AboutUsManager from './AboutUsManager';

const AdminPanel = ({ onAddProduct, onUpdateProduct, products, onDeleteProduct, aboutUsContent, onRefreshAboutUs }) => {
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [adminSearch, setAdminSearch] = useState('');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState('all');
  const [adminOriginFilter, setAdminOriginFilter] = useState('all');
  const [isAdminCategoryDropdownOpen, setIsAdminCategoryDropdownOpen] = useState(false);
  const [adminCategorySearch, setAdminCategorySearch] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [formCategorySearch, setFormCategorySearch] = useState('');
  const [imageFiles, setImageFiles] = useState([]); // Array of actual files to upload
  const [imagePreviews, setImagePreviews] = useState([]); // Array of strings For UI preview
  const [existingImages, setExistingImages] = useState([]); // Images already in database
  
  const [formData, setFormData] = useState({
    name: '',
    category: DEFAULT_CATEGORIES[0],
    origin: ORIGINS[0],
    price: '',
    discount: '',
    description: '',
    is_out_of_stock: false
  });

  const fetchOrders = async () => {
    setLoadingOrders(true);
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) setOrders(data);
    setLoadingOrders(false);
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const updateOrderStatus = async (orderId, newStatus) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    if (!error) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

      // WhatsApp Notification Logic
      const order = orders.find(o => o.id === orderId);
      if (order && order.customer_phone && newStatus !== 'pending') {
        let message = '';
        const name = order.customer_name || 'عميلنا العزيز';
        
        switch (newStatus) {
          case 'processing':
            message = `طلبكم رقم (${orderId}) من رايت ووتر جاري تجهيزه الآن.`;
            break;
          case 'completed':
            message = `تم اكتمال طلبكم رقم (${orderId}) من رايت ووتر وسيصلكم المندوب قريباً.`;
            break;
          case 'postponed':
            message = `تم تأجيل موعد تسليم طلبكم رقم (${orderId}) من رايت ووتر، سنوافيكم بالتفاصيل.`;
            break;
          case 'cancelled':
            message = `تم إلغاء طلبكم من رايت ووتر.`;
            break;
        }

        if (message) {
          let phone = order.customer_phone.replace(/\D/g, '');
          if (phone.startsWith('01') && phone.length === 11) {
            phone = '2' + phone;
          }
          const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
          window.open(waUrl, '_blank');
        }
      }
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImagePreview = (index, isExisting) => {
    if (isExisting) {
      setExistingImages(existingImages.filter((_, i) => i !== index));
    } else {
       setImageFiles(imageFiles.filter((_, i) => i !== index));
       setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Image requirement removed as per user request
    
    const productData = { ...formData, imageFiles, existingImages };
    
    if (editingProduct) {
      onUpdateProduct({ ...productData, id: editingProduct.id });
      setEditingProduct(null);
    } else {
      onAddProduct(productData);
    }

    // Reset state
    setFormData({
      name: '',
      category: DEFAULT_CATEGORIES[0],
      origin: ORIGINS[0],
      price: '',
      discount: '',
      description: '',
      is_out_of_stock: false
    });
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
    e.target.reset();
  };

  const handleEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category,
      origin: p.origin || ORIGINS[0],
      price: p.price,
      discount: p.discount || '',
      description: p.description || '',
      is_out_of_stock: p.is_out_of_stock || false
    });
    let imagesArr = [];
    if (p.images && p.images.length > 0) imagesArr = p.images;
    else if (p.image) imagesArr = [p.image];
    
    setExistingImages(imagesArr);
    setImagePreviews([]);
    setImageFiles([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: DEFAULT_CATEGORIES[0],
      origin: ORIGINS[0],
      price: '',
      discount: '',
      description: '',
      is_out_of_stock: false
    });
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
  };

  const filteredAdminProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(adminSearch.toLowerCase()) || 
                         p.category.toLowerCase().includes(adminSearch.toLowerCase()) ||
                         (p.origin && p.origin.toLowerCase().includes(adminSearch.toLowerCase()));
    const matchesCat = adminCategoryFilter === 'all' || p.category === adminCategoryFilter;
    const matchesOrigin = adminOriginFilter === 'all' || 
                         (adminOriginFilter === 'رايت ووتر' ? (p.origin === 'مصري' || p.origin === 'مصر' || p.origin === 'رايت ووتر' || !p.origin) : 
                          p.origin === adminOriginFilter);
    
    return matchesSearch && matchesCat && matchesOrigin;
  });

  return (
    <div className="admin-container">
      <div className="admin-header-row">
        <h2>لوحة التحكم</h2>
        <div className="admin-tabs">
          <button className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>المنتجات</button>
          <button className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>أوردرات العملاء</button>
          <button className={`admin-tab ${activeTab === 'aboutUs' ? 'active' : ''}`} onClick={() => setActiveTab('aboutUs')}>معلومات عنا</button>
        </div>
        <button className="logout-btn-chic" onClick={() => window.location.reload()}>
          تسجيل الخروج
        </button>
      </div>

      {activeTab === 'products' ? (
        <>
          <div className="admin-card chic-form">
            <h2 className="section-title">
              {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
            </h2>
            <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>اسم المنتج</label>
              <input
                type="text"
                className="chic-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label>القسم</label>
              <div className="compact-dropdown admin-form-dropdown">
                <button 
                  type="button"
                  className="dropdown-trigger"
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                >
                  <span className={`arrow ${isCategoryDropdownOpen ? 'open' : ''}`}>▼</span>
                  {formData.category}
                </button>
                {isCategoryDropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-search-wrapper">
                      <input 
                        type="text" 
                        placeholder="بحث عن قسم..." 
                        value={formCategorySearch}
                        onChange={(e) => setFormCategorySearch(e.target.value)}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    {DEFAULT_CATEGORIES
                      .filter(cat => cat.toLowerCase().includes(formCategorySearch.toLowerCase()))
                      .map(cat => (
                      <div 
                        key={cat}
                        className={`dropdown-item ${formData.category === cat ? 'selected' : ''}`}
                        onClick={() => { 
                          setFormData({ ...formData, category: cat }); 
                          setIsCategoryDropdownOpen(false); 
                          setFormCategorySearch(''); 
                        }}
                      >
                        {cat}
                      </div>
                    ))}
                    {DEFAULT_CATEGORIES.filter(cat => cat.toLowerCase().includes(formCategorySearch.toLowerCase())).length === 0 && (
                      <div className="dropdown-no-results">لا توجد نتائج</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>بلد المنشأ</label>
              <select
                className="chic-input"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                required
              >
                {ORIGINS.map(orig => (
                  <option key={orig} value={orig}>{orig}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>السعر (جنيه)</label>
              <input
                type="number"
                className="chic-input"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>سعر التخفيض (اختياري)</label>
              <input
                type="number"
                className="chic-input"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>صور المنتج (يمكنك اختيار عدة صور)</label>
            <div className="chic-upload-area">
              <input
                type="file"
                id="file-upload"
                className="hidden-file-input"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="custom-upload-btn mb-10">
                <span>إضافة صور للمنتج</span>
              </label>
              
              <div className="upload-previews-container row-flex">
                {existingImages.map((img, idx) => (
                  <div key={`existing-${idx}`} className="preview-item">
                    <img src={img} alt="Existing Preview" className="upload-preview-small" />
                    <button type="button" className="remove-preview-btn" onClick={() => removeImagePreview(idx, true)}>x</button>
                  </div>
                ))}
                {imagePreviews.map((preview, idx) => (
                  <div key={`new-${idx}`} className="preview-item">
                    <img src={preview} alt="New Preview" className="upload-preview-small" />
                    <button type="button" className="remove-preview-btn" onClick={() => removeImagePreview(idx, false)}>x</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>وصف المنتج</label>
            <textarea
              className="chic-input"
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label" style={{display:'flex', alignItems:'center', gap:'10px', fontWeight:'700', cursor:'pointer', color:'#ff4757', background: '#fff0f2', padding: '10px', borderRadius: '10px', border: '1px solid #ffccd2'}}>
              <input 
                type="checkbox" 
                checked={formData.is_out_of_stock}
                onChange={(e) => setFormData({ ...formData, is_out_of_stock: e.target.checked })}
                style={{transform: 'scale(1.5)', accentColor: '#ff4757'}}
              />
              نفذت الكمية (تعطيل الإضافة للسلة من العملاء)
            </label>
          </div>


          <div className="form-actions-row">
            <button type="submit" className="btn btn-primary submit-btn-chic">
              {editingProduct ? 'تحديث البيانات' : 'إضافة للكتالوج'}
            </button>
            {editingProduct && (
              <button type="button" className="btn btn-outline cancel-btn-chic" onClick={cancelEdit}>
                إلغاء التعديل
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-product-list">
        <div className="list-header-row">
          <h3 className="list-title">المنتجات الحالية ({products.length})</h3>
          <div className="admin-status-filters">
            <div className="compact-dropdown">
              <button 
                className={`dropdown-trigger ${adminCategoryFilter !== 'all' ? 'active' : ''}`}
                onClick={() => setIsAdminCategoryDropdownOpen(!isAdminCategoryDropdownOpen)}
              >
                <span className={`arrow ${isAdminCategoryDropdownOpen ? 'open' : ''}`}>▼</span>
                {adminCategoryFilter === 'all' ? 'كل الأقسام' : adminCategoryFilter}
              </button>
              {isAdminCategoryDropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-search-wrapper">
                    <input 
                      type="text" 
                      placeholder="بحث..." 
                      value={adminCategorySearch}
                      onChange={(e) => setAdminCategorySearch(e.target.value)}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  {(adminCategorySearch === '' || 'الكل'.includes(adminCategorySearch)) && (
                    <div 
                      className={`dropdown-item ${adminCategoryFilter === 'all' ? 'selected' : ''}`}
                      onClick={() => { setAdminCategoryFilter('all'); setIsAdminCategoryDropdownOpen(false); setAdminCategorySearch(''); }}
                    >
                      الكل
                    </div>
                  )}
                  {DEFAULT_CATEGORIES
                    .filter(cat => cat.toLowerCase().includes(adminCategorySearch.toLowerCase()))
                    .map(cat => (
                    <div 
                      key={cat}
                      className={`dropdown-item ${adminCategoryFilter === cat ? 'selected' : ''}`}
                      onClick={() => { setAdminCategoryFilter(cat); setIsAdminCategoryDropdownOpen(false); setAdminCategorySearch(''); }}
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <select 
              className="admin-mini-filter"
              value={adminOriginFilter}
              onChange={(e) => setAdminOriginFilter(e.target.value)}
            >
              <option value="all">كل المنشأ</option>
              {ORIGINS.map(orig => <option key={orig} value={orig}>{orig}</option>)}
            </select>
            <div className="admin-smart-search">
              <input 
                type="text" 
                placeholder="بحث..."
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="admin-items-grid">
          {filteredAdminProducts.map(p => (
            <div key={p.id} className="admin-chic-item">
              <img src={p.image && p.image !== '' ? p.image : 'https://placehold.co/100x100/2c3e50/white?text=No+Image'} alt={p.name} className="admin-item-img" />
              <div className="admin-item-details">
                <div className="admin-item-meta">
                  <span className="admin-item-cat">{p.category}</span>
                  <span className="admin-item-origin">{p.origin}</span>
                </div>
                <span className="admin-item-name">{p.name}</span>
                <span className="admin-item-price">{p.price} ج.م</span>
              </div>
              <div className="admin-item-actions">
                <button className="edit-btn-chic" onClick={() => handleEdit(p)}>تعديل</button>
                <button className="delete-btn-chic" onClick={() => onDeleteProduct(p.id)}>حذف</button>
              </div>
            </div>
          ))}
            {filteredAdminProducts.length === 0 && (
              <div className="no-results">لا توجد نتائج للبحث</div>
            )}
          </div>
        </div>
        </>
      ) : activeTab === 'orders' ? (
        <div className="admin-orders-section">
          <h2 className="section-title mb-10">إدارة طلبات العملاء</h2>
          {loadingOrders ? (
            <div className="loading">جاري تحميل الأوردرات...</div>
          ) : orders.length === 0 ? (
            <div className="empty-state">لا توجد طلبات حتى الآن.</div>
          ) : (
            <div className="orders-grid">
              {orders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div>
                      <h3>{order.customer_name}</h3>
                      <p>{order.customer_phone}</p>
                    </div>
                    <div className="order-status-badge">
                      <select 
                        value={order.status} 
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`status-select ${order.status}`}
                      >
                        <option value="pending">قيد الانتظار</option>
                        <option value="processing">جاري التجهيز</option>
                        <option value="completed">مكتمل</option>
                        <option value="postponed">مؤجل</option>
                        <option value="cancelled">ملغي</option>
                      </select>
                    </div>
                  </div>
                  <div className="order-details">
                    <p><strong>العنوان:</strong> {order.customer_address}</p>
                    <p><strong>التاريخ:</strong> {new Date(order.created_at).toLocaleDateString('ar-EG')} - {new Date(order.created_at).toLocaleTimeString('ar-EG')}</p>
                  </div>
                  <div className="order-items">
                    <h4>المنتجات المطلوبة:</h4>
                    <ul>
                      {order.items && order.items.map((item, idx) => (
                        <li key={idx}>- {item.product.name} (الكمية: {item.quantity}) = {item.product.price * item.quantity} ج.م</li>
                      ))}
                    </ul>
                  </div>
                  <div className="order-footer">
                    <strong>الإجمالي: {order.total_amount} ج.م</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <AboutUsManager 
          content={aboutUsContent} 
          onRefresh={onRefreshAboutUs} 
        />
      )}
    </div>
  );
};

export default AdminPanel;
