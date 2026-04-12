import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // تسجيل الدخول المباشر باسم admin وباسورد admin كما طلبت
    if (username === 'admin' && password === 'admin') {
      onLogin();
      return;
    }

    try {
      const { data, error: dbError } = await supabase
        .from('admin_auth')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (dbError || !data) {
        setError('خطأ في اسم المستخدم أو كلمة المرور');
        return;
      }

      onLogin();
    } catch (err) {
      setError('حدث خطأ أثناء الاتصال بقاعدة البيانات');
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
