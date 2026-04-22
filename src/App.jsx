import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import ProductCatalog from './components/ProductCatalog';
import AdminPanel from './components/AdminPanel';
import AboutUsPage from './components/AboutUsPage';
import WelcomePage from './components/WelcomePage';
import AdminLogin from './components/AdminLogin';
import Cart from './components/Cart';
import SidebarMenu from './components/SidebarMenu';
import { DEFAULT_CATEGORIES, ORIGINS } from './constants';
import logo from './assets/logo.png';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [view, setView] = useState(() => {
    return localStorage.getItem('rightwater_current_view') || 'welcome';
  });
  const [loading, setLoading] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('rightwater_admin_auth') === 'true';
  });
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeOrigin, setActiveOrigin] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Initialize cart from localStorage if available
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('rightwater_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error('Error loading cart:', e);
      return [];
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('rightwater_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // حفظ حالة الصفحة وتسجيل الدخول عند التغيير
  useEffect(() => {
    localStorage.setItem('rightwater_current_view', view);
    localStorage.setItem('rightwater_admin_auth', isAdminAuthenticated);
  }, [view, isAdminAuthenticated]);

  const [aboutUsContent, setAboutUsContent] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchAboutUsContent();

    // تفعيل التحديث الفوري (Realtime)
    const productsChannel = supabase
      .channel('products_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'products' 
      }, () => {
        fetchProducts();
      })
      .subscribe();

    const aboutUsChannel = supabase
      .channel('about_us_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'about_us_content' 
      }, () => {
        fetchAboutUsContent();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(aboutUsChannel);
    };
  }, []);

  const fetchAboutUsContent = async () => {
    const { data } = await supabase
      .from('about_us_content')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setAboutUsContent(data);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('id, name, category, origin, description, price, discount, image, images, is_out_of_stock, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const filteredProducts = products.filter(p => {
    const matchesCat = activeCategory === 'all' || p.category === activeCategory;
    const matchesOrigin = activeOrigin === 'all' || 
                         (activeOrigin === 'رايت ووتر' ? (p.origin === 'مصري' || p.origin === 'مصر' || p.origin === 'رايت ووتر' || !p.origin) : 
                          activeOrigin === 'صيني' ? (p.origin === 'صيني' || p.origin === 'الصين') : 
                          activeOrigin === 'فيتنامي' ? (p.origin === 'فيتنامي' || p.origin === 'فيتنام') : 
                          p.origin === activeOrigin);
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesOrigin && matchesSearch;
  });

  if (view === 'welcome') {
    return <WelcomePage onExplore={() => setView('catalog')} />;
  }

  return (
    <div className="app-container">
      <header className="main-header">
        <div className="header-container">
          <div className="header-left">
            <button 
              className="hamburger-btn mobile-only" 
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Menu"
            >
              <div className="hamburger-line"></div>
              <div className="hamburger-line"></div>
              <div className="hamburger-line"></div>
            </button>
            <div className="logo" onClick={() => setView('catalog')} style={{ cursor: 'pointer' }}>
              رايت <span>ووتر</span>
            </div>
            
            <nav className="header-nav-primary">
              <button 
                className={`nav-btn ${view === 'catalog' ? 'active' : ''}`}
                onClick={() => setView('catalog')}
              >
                <span className="nav-icon">💧</span>
                المنتجات
              </button>
              <button 
                className={`nav-btn ${view === 'aboutUs' ? 'active' : ''}`}
                onClick={() => setView('aboutUs')}
              >
                <span className="nav-icon">🏢</span>
                معلومات عنا
              </button>
            </nav>
          </div>
          
          <div className="header-center">
            {view === 'catalog' && (
              <div className="header-tools">
                <div className="search-box-chic">
                  <input
                    type="text"
                    placeholder="بحث عن منتج..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="compact-dropdown">
                  <button 
                    className={`dropdown-trigger ${activeCategory !== 'all' ? 'active' : ''}`}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    {activeCategory === 'all' ? 'الأقسام' : activeCategory}
                    <span className={`arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
                  </button>
                  {isDropdownOpen && (
                    <div className="dropdown-menu">
                      <div className="dropdown-search-wrapper">
                        <input 
                          type="text" 
                          placeholder="بحث عن قسم..." 
                          value={categorySearch}
                          onChange={(e) => setCategorySearch(e.target.value)}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      {(categorySearch === '' || 'الكل'.includes(categorySearch)) && (
                        <div 
                          className={`dropdown-item ${activeCategory === 'all' ? 'selected' : ''}`}
                          onClick={() => { setActiveCategory('all'); setIsDropdownOpen(false); setCategorySearch(''); }}
                        >
                          الكل
                        </div>
                      )}
                      {DEFAULT_CATEGORIES
                        .filter(cat => cat.toLowerCase().includes(categorySearch.toLowerCase()))
                        .map(cat => (
                        <div 
                          key={cat}
                          className={`dropdown-item ${activeCategory === cat ? 'selected' : ''}`}
                          onClick={() => { setActiveCategory(cat); setIsDropdownOpen(false); setCategorySearch(''); }}
                        >
                          {cat}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="header-actions">
            {view === 'catalog' ? (
              <div className="action-buttons">
                <button className="cart-icon-btn" onClick={() => setView('cart')}>
                  🛒 <span className="cart-count">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
                </button>
                <button className="admin-btn-minimal" onClick={() => setView('admin')}>
                  لوحة المدير
                </button>
              </div>
            ) : (
              <button className="btn-back-chic" onClick={() => setView('catalog')}>
                ← العودة للكتالوج
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        {loading ? (
          <div className="loading">جاري التحميل...</div>
        ) : view === 'catalog' ? (
          <>
            <section className="catalog-filters-section fade-in">
              <div className="catalog-hero-mini">
                <div className="hero-video-container">
                  <iframe 
                    width="100%" 
                    height="315" 
                    src="https://www.youtube.com/embed/nlkDbwUwQ7g?si=5lHnVvO0oazcdICy&autoplay=1&mute=1&loop=1&playlist=nlkDbwUwQ7g" 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen
                    className="hero-video-iframe"
                  ></iframe>
                </div>
                <h1>عالم النقاء بين يديك</h1>
              </div>
              
              <div className="filters-container-main">
                <div className="filter-group">
                  <span className="filter-label">حسب المنشأ:</span>
                  <div className="origin-tabs">
                    <button 
                      className={`origin-tab ${activeOrigin === 'all' ? 'active' : ''}`}
                      onClick={() => setActiveOrigin('all')}
                    >
                      الكل
                    </button>
                    {ORIGINS.map(orig => (
                      <button 
                        key={orig}
                        className={`origin-tab ${activeOrigin === orig ? 'active' : ''}`}
                        onClick={() => setActiveOrigin(orig)}
                      >
                        {orig}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
            <ProductCatalog products={filteredProducts} onAddToCart={handleAddToCart} />
          </>
        ) : view === 'cart' ? (
          <Cart 
            cartItems={cartItems}
            onUpdateQuantity={updateCartQuantity}
            onRemoveItem={removeFromCart}
            onBack={() => setView('catalog')}
            clearCart={() => setCartItems([])}
          />
        ) : view === 'aboutUs' ? (
          <AboutUsPage 
            content={aboutUsContent} 
            onBack={() => setView('catalog')} 
          />
        ) : (
          <>
            {!isAdminAuthenticated ? (
              <AdminLogin onLogin={() => setIsAdminAuthenticated(true)} />
            ) : (
              <AdminPanel
                products={products}
                onLogout={() => {
                  setIsAdminAuthenticated(false);
                  localStorage.removeItem('rightwater_admin_auth');
                  setView('catalog');
                }}
                onAddProduct={async (p) => {
                  const { imageFiles, price, discount } = p;
                  let imageUrls = [];
                  
                  // Sanitize numeric fields
                  const sanitizedPrice = parseFloat(price) || 0;
                  const sanitizedDiscount = (discount && discount !== '') ? parseFloat(discount) : null;

                  if (imageFiles && imageFiles.length > 0) {
                    try {
                      const uploadPromises = imageFiles.map(async (file) => {
                        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
                        const fileName = `${Date.now()}-${cleanFileName}`;
                        const { data: uploadData, error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file);
                        if (!uploadError) {
                          return supabase.storage.from('product-images').getPublicUrl(fileName).data.publicUrl;
                        }
                        return null;
                      });
                      const urls = await Promise.all(uploadPromises);
                      imageUrls = urls.filter(url => url !== null);
                    } catch (err) {
                      console.error('Images upload failed:', err);
                    }
                  }

                  // تحديد الأعمدة الموجودة في قاعدة البيانات فقط بشكل صريح
                  const insertData = {
                    name: p.name || '',
                    category: p.category || '',
                    origin: p.origin || '',
                    description: p.description || '',
                    is_out_of_stock: p.is_out_of_stock || false,
                    price: sanitizedPrice,
                    discount: sanitizedDiscount,
                    images: imageUrls,
                    image: imageUrls.length > 0 ? imageUrls[0] : ''
                  };

                  const { data: inserted, error } = await supabase.from('products').insert([insertData]).select();

                  if (!error) {
                    if (inserted && inserted[0]) {
                      setProducts(prev => [inserted[0], ...prev]);
                    }
                    alert('تم إضافة المنتج بنجاح! ✅');
                  } else {
                    alert('حدث خطأ أثناء حفظ المنتج.\nالخطأ: ' + error.message);
                  }
                }}
                onUpdateProduct={async (p) => {
                  const { id, imageFiles, existingImages, price, discount, ...data } = p;
                  let imageUrls = existingImages || [];

                  // Sanitize numeric fields
                  const sanitizedPrice = parseFloat(price) || 0;
                  const sanitizedDiscount = (discount && discount !== '') ? parseFloat(discount) : null;

                  if (imageFiles && imageFiles.length > 0) {
                    try {
                      const uploadPromises = imageFiles.map(async (file) => {
                        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
                        const fileName = `${Date.now()}-${cleanFileName}`;
                        const { data: uploadData, error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file);
                        if (!uploadError) {
                          return supabase.storage.from('product-images').getPublicUrl(fileName).data.publicUrl;
                        }
                        return null;
                      });
                      const urls = await Promise.all(uploadPromises);
                      const newUrls = urls.filter(url => url !== null);
                      imageUrls = [...imageUrls, ...newUrls];
                    } catch (err) {
                      console.error('Images upload failed:', err);
                    }
                  }

                  // تحديد الأعمدة الموجودة في قاعدة البيانات فقط بشكل صريح
                  const updateData = {
                    name: p.name || '',
                    category: p.category || '',
                    origin: p.origin || '',
                    description: p.description || '',
                    is_out_of_stock: p.is_out_of_stock || false,
                    price: sanitizedPrice,
                    discount: sanitizedDiscount,
                    images: imageUrls,
                    image: imageUrls.length > 0 ? imageUrls[0] : ''
                  };

                  const { error } = await supabase.from('products').update(updateData).eq('id', id);
                  
                  if (!error) {
                    setProducts(prev => prev.map(item => item.id === id ? { 
                      ...item, 
                      ...data, 
                      price: sanitizedPrice, 
                      discount: sanitizedDiscount, 
                      images: imageUrls,
                      image: imageUrls.length > 0 ? imageUrls[0] : '' 
                    } : item));
                    alert('تم حفظ التعديلات بنجاح! ✅');
                  } else {
                    alert('حدث خطأ أثناء التحديث.\nالخطأ: ' + error.message);
                  }
                }}
                onDeleteProduct={async (id) => {
                  if (window.confirm('حذف؟')) {
                    const { error } = await supabase.from('products').delete().eq('id', id);
                    if (!error) setProducts(products.filter(p => p.id !== id));
                  }
                }}
                aboutUsContent={aboutUsContent}
                onRefreshAboutUs={fetchAboutUsContent}
              />
            )}
          </>
        )}
      </main>

      <footer>
        <p>&copy; 2026 رايت ووتر لتنقية المياه</p>
      </footer>

      <SidebarMenu 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categories={DEFAULT_CATEGORIES}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onAdminClick={() => setView('admin')}
      />
    </div>
  );
}

export default App;
