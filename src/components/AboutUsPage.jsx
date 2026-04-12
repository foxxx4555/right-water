import React, { useState } from 'react';

const AboutUsPage = ({ content, onBack }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const videos = content.filter(item => item.type === 'video');
  const images = content.filter(item => item.type === 'image');
  const articles = content.filter(item => item.type === 'article');

  return (
    <div className="about-us-container-chic fade-in">
      <div className="about-us-hero-chic">
        <div className="glass-overlay">
          <h1>عملائنا هم شركاء النجاح</h1>
          <p>اكتشف عالم النقاء والجودة في رايت ووتر من خلال أعمالنا ومنتجاتنا</p>
        </div>
        <button className="btn-back-floating" onClick={onBack}>
          ← العودة للكتالوج
        </button>
      </div>

      <div className="about-us-content-wrapper">
        {videos.length > 0 && (
          <section className="about-section-chic">
            <h2 className="section-title-premium">📹 فيديوهات من أعمالنا</h2>
            <div className="video-grid-premium">
              {videos.map(video => (
                <div key={video.id} className="video-card-premium">
                  <div className="video-wrapper">
                    <video controls>
                      <source src={video.media_url} type="video/mp4" />
                      المتصفح لا يدعم عرض الفيديو.
                    </video>
                  </div>
                  {video.title && <h3 className="media-title-chic">{video.title}</h3>}
                </div>
              ))}
            </div>
          </section>
        )}

        {images.length > 0 && (
          <section className="about-section-chic">
            <h2 className="section-title-premium">📸 معرض الصور والتركيبات</h2>
            <div className="image-gallery-premium">
              {images.map(img => (
                <div key={img.id} className="gallery-item-premium" onClick={() => setSelectedImage(img)}>
                  <div className="img-container">
                    <img src={img.media_url} alt={img.title || 'صورة الشركة'} />
                  </div>
                  <button className="btn-read-more-overlay">
                    🔍 عرض المزيد
                  </button>
                  {img.title && <div className="img-caption-chic">{img.title}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {articles.length > 0 && (
          <section className="about-section-chic">
            <h2 className="section-title-premium">📰 مقالات وأخبار الشركة</h2>
            <div className="articles-grid-premium">
              {articles.map(article => (
                <div key={article.id} className="article-card-premium">
                  <div className="article-inner">
                    <div className="article-badge">جديد</div>
                    {article.title && <h3 className="article-title-chic">{article.title}</h3>}
                    <div className="article-body-chic">
                      {article.content.split('\n').map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                    <div className="article-footer-chic">
                      <span className="article-date-chic">
                        📅 {new Date(article.created_at).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {content.length === 0 && (
          <div className="empty-state-chic">
            <div className="empty-icon">🏢</div>
            <h3>محتوى قادم قريباً</h3>
            <p>ترقبوا عرض أهم إنجازاتنا وفيديوهاتنا الحصرية هنا في أقرب وقت.</p>
          </div>
        )}
      </div>

      {/* Image Fullscreen Modal */}
      {selectedImage && (
        <div className="fullscreen-modal-overlay" onClick={() => setSelectedImage(null)}>
          <button className="modal-close-icon" onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}>
            ×
          </button>
          <img 
            src={selectedImage.media_url} 
            alt={selectedImage.title} 
            className="fullscreen-image" 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

    </div>
  );
};

export default AboutUsPage;
