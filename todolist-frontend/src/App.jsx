import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Loader2, ListTodo } from 'lucide-react';
import { fetchTasks, removeTask } from './store/taskSlice';
import Toast from './components/common/Toast';
import Header from './components/common/Header';
import Auth from './components/auth/Auth';
import Sidebar from './components/tasks/Sidebar';
import TaskCard from './components/tasks/TaskCard';
import TaskModal from './components/tasks/TaskModal';
import ConfirmModal from './components/common/ConfirmModal';

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const { items: tasks, loading, error, filters } = useSelector(state => state.tasks);
  const { search, completedFilter, dueDateFilter, priorityFilter } = filters;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [confirmTaskId, setConfirmTaskId] = useState(null);

  // Trigger tasks fetch when user or filters change
  useEffect(() => {
    if (user) {
      dispatch(fetchTasks());
    }
  }, [user, search, completedFilter, dueDateFilter, priorityFilter, dispatch]);

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Render auth screen if not logged in
  if (!user) {
    return (
      <>
        <Toast />
        <Auth />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Toast Notification */}
      <Toast />

      {/* Navigation Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Panel: Search & Filters */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>

          {/* Right Panel: Task List */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Danh sách công việc</h2>
                <p className="text-slate-500 text-sm">
                  {tasks.length} công việc được tìm thấy
                </p>
              </div>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition-all"
              >
                <Plus size={18} />
                Thêm công việc
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="animate-spin text-indigo-600" size={32} />
                <span className="text-slate-500 text-sm font-medium">Đang tải danh sách công việc...</span>
              </div>
            ) : tasks.length === 0 ? (
              <div className="bg-white border border-slate-200/80 rounded-2xl py-16 px-4 text-center">
                <div className="inline-flex p-4 bg-slate-50 text-slate-400 rounded-full mb-3">
                  <ListTodo size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Không có công việc nào</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                  Hãy bắt đầu bằng cách thêm công việc mới hoặc thử thay đổi bộ lọc tìm kiếm.
                </p>
                <button
                  onClick={openCreateModal}
                  className="mt-4 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-semibold"
                >
                  <Plus size={16} /> Thêm công việc đầu tiên
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onEdit={openEditModal} 
                    onDelete={setConfirmTaskId}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Task Modal (Create & Edit) */}
      <TaskModal 
        task={editingTask}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Custom Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmTaskId !== null}
        title="Xác nhận xóa công việc"
        message="Bạn có chắc chắn muốn xóa công việc này không? Hành động này không thể hoàn tác."
        onConfirm={() => dispatch(removeTask(confirmTaskId))}
        onClose={() => setConfirmTaskId(null)}
      />
    </div>
  );
}
