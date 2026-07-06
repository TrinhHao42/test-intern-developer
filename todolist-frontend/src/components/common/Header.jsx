import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut, User, ListTodo } from 'lucide-react';
import { logout } from '../../store/authSlice';
import { clearTasks } from '../../store/taskSlice';

export default function Header() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearTasks());
  };

  if (!user) return null;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 backdrop-blur-md bg-white/95">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-600 text-white p-2 rounded-xl">
            <ListTodo size={22} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-950">Todo List</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg">
            <User size={16} className="text-indigo-500" />
            <span>Xin chào, <strong className="font-semibold text-slate-800">{user.name}</strong></span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors py-1.5 px-3 rounded-lg hover:bg-red-50"
            title="Đăng xuất"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </div>
    </header>
  );
}
