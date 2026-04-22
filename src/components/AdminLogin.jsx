import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // تنظيف المدخلات من المسافات الزائدة
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    // تسجيل الدخول المباشر باسم admin وباسورد admin كما طلبت
    if (cleanUsername === 'admin' && cleanPassword === 'admin') {
      onLogin();
      return;
    }

    try {
      const { data, error: dbError } = await supabase
        .from('admin_auth')
        .select('*')
        .eq('username', cleanUsername)
        .eq('password', cleanPassword)
        .single();

      if (dbError) {
        // إذا كان الجدول غير موجود (خطأ 404 أو PGRST116)
        if (dbError.code === 'PGRST116' || dbError.message?.includes('not found')) {
          setError('خطأ في اسم المستخدم أو كلمة المرور');
        } else {
          console.error('Database Error:', dbError);
          setError('حدث خطأ في الاتصال بقاعدة البيانات. تأكد من إعداد الجدول.');
        }
        return;
      }

      if (!data) {
        setError('خطأ في اسم المستخدم أو كلمة المرور');
        return;
      }

      onLogin();
    } catch (err) {
      setError('حدث خطأ غير متوقع أثناء الاتصال');
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-card fade-in-up">
        <div className="login-header">
          <div className="logo">رايت <span>ووتر</span></div>
          <h2>تسجيل دخول المدير</h2>
          <p>يرجى إدخال البيانات للوصول للوحة التحكم</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">اسم المستخدم</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">كلمة المرور</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary login-btn">
            دخول للوحة التحكم
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
