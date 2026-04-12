import React, { useState } from 'react';

const SidebarMenu = ({ 
  isOpen, 
  onClose, 
  categories, 
  activeCategory, 
  setActiveCategory,
  onAdminClick 
}) => {
  const [catSearch, setCatSearch] = useState('');

  const filteredCategories = categories.filter(cat => 
    cat.toLowerCase().includes(catSearch.toLowerCase())
  );

  return (
    <>
      {/* Overlay to dim background when sidebar is open */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`} 
        onClick={onClose}
      ></div>

      {/* Sidebar Drawer */}
      <div className={`sidebar-drawer ${isOpen ? 'open' : ''}`}>
        
        {/* Header of the sidebar */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            رايت <span>ووتر</span>
          </div>
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Close menu">
            ×
          </button>
        </div>

        {/* Inner Context */}
        <div className="sidebar-content">

          <h3 className="sidebar-title">أقسام المنتجات</h3>
          
          <div className="sidebar-search mb-10">
            <input
              type="text"
              placeholder="بحث عن قسم..."
              value={catSearch}
              onChange={(e) => setCatSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fbff', marginBottom: '10px' }}
            />
          </div>

          {/* Categories Accordion/List */}
          <div className="sidebar-categories">
            {(catSearch === '' || 'جميع المنتجات'.includes(catSearch)) && (
              <button 
                className={`sidebar-cat-btn ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => { setActiveCategory('all'); onClose(); setCatSearch(''); }}
              >
                <span>جميع المنتجات</span>
                {activeCategory === 'all' && <span className="active-dot"></span>}
              </button>
            )}
            
            {filteredCategories.map(cat => (
              <button 
                key={cat}
                className={`sidebar-cat-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => { setActiveCategory(cat); onClose(); setCatSearch(''); }}
              >
                <span>{cat}</span>
                {activeCategory === cat && <span className="active-dot"></span>}
              </button>
            ))}

            {filteredCategories.length === 0 && catSearch !== '' && (
              <div className="no-results-chic" style={{ textAlign: 'center', padding: '15px', color: '#94a3b8', fontSize: '0.9rem' }}>
                لا توجد أقسام مطابقة لـ "{catSearch}"
              </div>
            )}
          </div>

        </div>

        {/* Footer of the sidebar (Admin Panel) */}
        <div className="sidebar-footer">
          <button className="sidebar-admin-btn" onClick={() => { onAdminClick(); onClose(); }}>
            🛡️ تسجيل دخول الإدارة
          </button>
        </div>

      </div>
    </>
  );
};

export default SidebarMenu;
