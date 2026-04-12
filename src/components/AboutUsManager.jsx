import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const AboutUsManager = ({ content, onRefresh }) => {
  const [type, setType] = useState('image'); // 'image', 'video', 'article'
  const [title, setTitle] = useState('');
  const [contentBody, setContentBody] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let mediaUrl = '';
    
    if (type !== 'article' && mediaFile) {
      const cleanFileName = mediaFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const fileName = `${Date.now()}-${cleanFileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, mediaFile);
      
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        mediaUrl = publicUrl;
      } else {
         alert('فشل رفع الملف: ' + uploadError.message);
         setLoading(false);
         return;
      }
    }

    const { error } = await supabase.from('about_us_content').insert([{
      type,
      title,
      content: contentBody,
      media_url: mediaUrl
    }]);

    if (!error) {
      alert('تمت الإضافة بنجاح! ✅');
      setTitle('');
      setContentBody('');
      setMediaFile(null);
      setMediaPreview(null);
      onRefresh();
    } else {
      alert('خطأ في الإضافة: ' + error.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من الحذف؟')) {
      const { error } = await supabase.from('about_us_content').delete().eq('id', id);
      if (!error) onRefresh();
    }
  };

  return (
    <div className="admin-card chic-form fade-in-up">
      <h2 className="section-title">✨ إدارة محتوى "معلومات عنا"</h2>
      
      <form onSubmit={handleSubmit} className="mb-20">
        <div className="form-grid">
          <div className="form-group">
            <label>النوع</label>
            <select className="chic-input" value={type} onChange={(e) => {
              setType(e.target.value);
              setMediaFile(null);
              setMediaPreview(null);
            }}>
              <option value="image">🖼️ صورة شركة</option>
              <option value="video">🎥 فيديو شركة</option>
              <option value="article">📝 مقال / خبر</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>العنوان</label>
            <input 
              type="text" 
              className="chic-input" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="مثلاً: افتتاح الفرع الجديد"
              required
            />
          </div>
        </div>

        {type !== 'article' && (
          <div className="form-group mt-10">
            <label>{type === 'video' ? 'اختر فيديو' : 'اختر صورة'}</label>
            <div className="chic-upload-area">
              <input 
                type="file" 
                id="about-media-upload"
                className="hidden-file-input" 
                accept={type === 'video' ? 'video/*' : 'image/*'} 
                onChange={handleFileChange} 
              />
              <label htmlFor="about-media-upload" className="custom-upload-btn">
                <span>{mediaFile ? `تم اختيار: ${mediaFile.name}` : `إضافة ${type === 'video' ? 'فيديو' : 'صورة'}`}</span>
                {mediaPreview && type === 'image' && <img src={mediaPreview} alt="Preview" className="upload-preview" />}
                {mediaPreview && type === 'video' && <div className="upload-preview" style={{display:'flex', alignItems:'center', justifyContent:'center', background:'#003366', color:'white'}}>🎬</div>}
              </label>
            </div>
          </div>
        )}

        {type === 'article' && (
          <div className="form-group mt-10">
            <label>محتوى المقال</label>
            <textarea 
              className="chic-input" 
              rows="4" 
              value={contentBody} 
              onChange={(e) => setContentBody(e.target.value)}
              placeholder="اكتب هنا تفاصيل الخبر أو المقال..."
              required
            ></textarea>
          </div>
        )}

        <div className="form-actions-row">
          <button type="submit" className="btn btn-primary submit-btn-chic" disabled={loading}>
            {loading ? '⏳ جاري الإضافة...' : '➕ إضافة المحتوى'}
          </button>
        </div>
      </form>

      <div className="content-list-section mt-40">
        <div className="list-header-row">
          <h3 className="list-title">📋 المحتوى الحالي</h3>
        </div>
        
        {content.length === 0 ? (
          <div className="no-results">لا يوجد محتوى مضاف حالياً</div>
        ) : (
          <div className="about-us-grid">
            {content.map(item => (
              <div key={item.id} className="about-us-card">
                <div className="about-us-media-preview">
                  {item.type === 'image' && item.media_url && (
                    <img src={item.media_url} alt={item.title} className="preview-img" />
                  )}
                  {item.type === 'video' && item.media_url && (
                    <video className="preview-video" src={item.media_url} muted></video>
                  )}
                  {item.type === 'article' && (
                    <div className="article-icon-preview">📝</div>
                  )}
                  {!item.media_url && item.type !== 'article' && (
                    <div className="no-image-overlay">لا يوجد ميديا</div>
                  )}
                </div>
                
                <div className="about-us-item-info">
                  <span className={`about-us-item-type ${item.type}`}>
                    {item.type === 'image' ? 'صورة' : item.type === 'video' ? 'فيديو' : 'مقال'}
                  </span>
                  <h4 className="about-us-item-title">{item.title || 'بدون عنوان'}</h4>
                  {item.type === 'article' && (
                    <p className="about-us-item-body">{item.content}</p>
                  )}
                </div>
                
                <div className="about-us-card-actions">
                  <button className="delete-btn-chic" style={{padding: '5px 15px', fontSize: '0.8rem'}} onClick={() => handleDelete(item.id)}>
                    🗑️ حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutUsManager;
