import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AlertCircle } from 'lucide-react';
import { addTask, editTask } from '../../store/taskSlice';

export default function TaskModal({ task, isOpen, onClose }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    id: null,
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: '',
    completed: false
  });
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        id: task.id || null,
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'MEDIUM',
        dueDate: task.dueDate || '',
        completed: task.completed || false
      });
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      setForm({
        id: null,
        title: '',
        description: '',
        priority: 'MEDIUM',
        dueDate: tomorrowStr,
        completed: false
      });
    }
    setLocalError('');
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!form.title.trim()) {
      setLocalError('Tiêu đề công việc không được để trống.');
      return;
    }
    if (form.title.trim().length > 255) {
      setLocalError('Tiêu đề không được vượt quá 255 ký tự.');
      return;
    }
    if (form.description && form.description.length > 1000) {
      setLocalError('Mô tả không được vượt quá 1000 ký tự.');
      return;
    }

    const taskData = {
      title: form.title,
      description: form.description,
      priority: form.priority,
      dueDate: form.dueDate || null,
      completed: form.completed
    };

    setLoading(true);
    try {
      if (form.id) {
        await dispatch(editTask({ id: form.id, taskData })).unwrap();
      } else {
        await dispatch(addTask(taskData)).unwrap();
      }
      onClose();
    } catch (err) {
      setLocalError(err || 'Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-lg text-slate-900">
            {form.id ? 'Cập nhật công việc' : 'Thêm công việc mới'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg font-bold"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {localError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg flex items-center gap-2">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span>{localError}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Học lập trình React..."
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={form.title}
              onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Mô tả</label>
            <textarea
              placeholder="Chi tiết nội dung công việc..."
              rows="3"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Độ ưu tiên</label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                value={form.priority}
                onChange={e => setForm(prev => ({ ...prev, priority: e.target.value }))}
                disabled={loading}
              >
                <option value="LOW">Thấp</option>
                <option value="MEDIUM">Trung bình</option>
                <option value="HIGH">Cao</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Hạn chót</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={form.dueDate}
                onChange={e => setForm(prev => ({ ...prev, dueDate: e.target.value }))}
                disabled={loading}
              />
            </div>
          </div>

          {form.id && (
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="modal-completed"
                className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-slate-300"
                checked={form.completed}
                onChange={e => setForm(prev => ({ ...prev, completed: e.target.checked }))}
                disabled={loading}
              />
              <label htmlFor="modal-completed" className="text-sm font-medium text-slate-700">
                Đã hoàn thành công việc này
              </label>
            </div>
          )}

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium"
              disabled={loading}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-semibold shadow-sm hover:shadow"
              disabled={loading}
            >
              {loading ? 'Đang lưu...' : 'Lưu công việc'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
