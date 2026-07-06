import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ListTodo, AlertCircle, Loader2 } from 'lucide-react';
import { login, register, clearAuthError, resetRegisterSuccess } from '../../store/authSlice';
import { showToast } from '../../store/taskSlice';

export default function Auth() {
  const dispatch = useDispatch();
  const { loading, error, registerSuccess } = useSelector(state => state.auth);
  
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [form, setForm] = useState({ username: '', password: '', name: '' });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    // Clear errors when switching modes
    dispatch(clearAuthError());
    setValidationErrors({});
  }, [authMode, dispatch]);

  useEffect(() => {
    if (registerSuccess) {
      dispatch(showToast({ message: 'Đăng ký tài khoản thành công! Hãy đăng nhập.', type: 'success' }));
      setAuthMode('login');
      setForm({ username: '', password: '', name: '' });
      setValidationErrors({});
      dispatch(resetRegisterSuccess());
    }
  }, [registerSuccess, dispatch]);

  const validate = () => {
    const newErrors = {};
    if (authMode === 'register') {
      if (!form.name.trim()) {
        newErrors.name = 'Tên hiển thị không được để trống.';
      } else if (form.name.trim().length < 2 || form.name.trim().length > 100) {
        newErrors.name = 'Tên hiển thị phải từ 2 đến 100 ký tự.';
      }
      
      if (!form.username.trim()) {
        newErrors.username = 'Tên đăng nhập không được để trống.';
      } else if (form.username.trim().length < 4 || form.username.trim().length > 50) {
        newErrors.username = 'Tên đăng nhập phải từ 4 đến 50 ký tự.';
      }

      if (!form.password) {
        newErrors.password = 'Mật khẩu không được để trống.';
      } else {
        if (form.password.length < 8) {
          newErrors.password = 'Mật khẩu phải có ít nhất 8 kí tự.';
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/.test(form.password)) {
          newErrors.password = 'Mật khẩu phải có ít nhất 1 kí tự in hoa, 1 kí tự in thường, 1 kí tự số và 1 kí tự đặc biệt.';
        }
      }
    } else {
      if (!form.username.trim()) {
        newErrors.username = 'Tên đăng nhập không được để trống.';
      }
      if (!form.password) {
        newErrors.password = 'Mật khẩu không được để trống.';
      }
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    if (authMode === 'login') {
      dispatch(login({ username: form.username.trim(), password: form.password }));
    } else {
      dispatch(register({ 
        username: form.username.trim(), 
        password: form.password, 
        name: form.name.trim() 
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl mb-4">
            <ListTodo size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Todo List</h2>
          <p className="mt-2 text-sm text-slate-500">
            Quản lý công việc hàng ngày một cách hiệu quả và khoa học
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên</label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                  validationErrors.name ? 'border-red-500 bg-red-50/10' : 'border-slate-200'
                }`}
                value={form.name}
                onChange={e => {
                  setForm(prev => ({ ...prev, name: e.target.value }));
                  if (validationErrors.name) setValidationErrors(prev => ({ ...prev, name: '' }));
                }}
              />
              {validationErrors.name && (
                <span className="text-xs font-semibold text-red-600 mt-1 block">{validationErrors.name}</span>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tên đăng nhập</label>
            <input
              type="text"
              placeholder="username"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                validationErrors.username ? 'border-red-500 bg-red-50/10' : 'border-slate-200'
              }`}
              value={form.username}
              onChange={e => {
                setForm(prev => ({ ...prev, username: e.target.value }));
                if (validationErrors.username) setValidationErrors(prev => ({ ...prev, username: '' }));
              }}
            />
            {validationErrors.username && (
              <span className="text-xs font-semibold text-red-600 mt-1 block">{validationErrors.username}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              placeholder="••••••••"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                validationErrors.password ? 'border-red-500 bg-red-50/10' : 'border-slate-200'
              }`}
              value={form.password}
              onChange={e => {
                setForm(prev => ({ ...prev, password: e.target.value }));
                if (validationErrors.password) setValidationErrors(prev => ({ ...prev, password: '' }));
              }}
            />
            {validationErrors.password && (
              <span className="text-xs font-semibold text-red-600 mt-1 block">{validationErrors.password}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : authMode === 'login' ? (
              'Đăng nhập'
            ) : (
              'Tạo tài khoản'
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
            onClick={() => {
              setAuthMode(authMode === 'login' ? 'register' : 'login');
              setForm({ username: '', password: '', name: '' });
            }}
          >
            {authMode === 'login' ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  );
}
