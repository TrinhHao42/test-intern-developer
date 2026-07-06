import React from 'react';
import { useDispatch } from 'react-redux';
import { Calendar, CheckCircle2, Circle, Edit2, Trash2 } from 'lucide-react';
import { toggleTaskComplete, removeTask } from '../../store/taskSlice';

export default function TaskCard({ task, onEdit, onDelete }) {
  const dispatch = useDispatch();

  const handleToggleComplete = () => {
    dispatch(toggleTaskComplete(task));
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  // Priority color utilities
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'text-red-700 bg-red-50 border border-red-200';
      case 'MEDIUM':
        return 'text-amber-700 bg-amber-50 border border-amber-200';
      case 'LOW':
        return 'text-emerald-700 bg-emerald-50 border border-emerald-200';
      default:
        return 'text-slate-600 bg-slate-50 border border-slate-200';
    }
  };

  const getPriorityLabel = (priority) => {
    if (priority === 'HIGH') return 'Cao';
    if (priority === 'MEDIUM') return 'Trung bình';
    if (priority === 'LOW') return 'Thấp';
    return priority;
  };

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Không có';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  };

  // Check if task is overdue
  const isOverdue = () => {
    if (!task.dueDate || task.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  return (
    <div 
      className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden ${
        task.completed ? 'border-slate-100 bg-slate-50/50' : 'border-slate-200'
      }`}
    >
      {/* Visual bar indicating priority */}
      <div className={`absolute top-0 left-0 bottom-0 w-1 ${
        task.completed ? 'bg-slate-300' :
        task.priority === 'HIGH' ? 'bg-red-500' :
        task.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'
      }`}></div>

      <div className="pl-2">
        <div className="flex items-start justify-between gap-4 mb-2">
          {/* Complete Checkbox & Title */}
          <div className="flex items-start gap-3">
            <button 
              onClick={handleToggleComplete}
              className={`flex-shrink-0 mt-0.5 transition-colors ${
                task.completed ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'
              }`}
            >
              {task.completed ? (
                <CheckCircle2 size={22} className="fill-indigo-50" />
              ) : (
                <Circle size={22} />
              )}
            </button>
            
            <div>
              <h3 className={`font-semibold text-slate-900 leading-tight ${
                task.completed ? 'line-through text-slate-400' : ''
              }`}>
                {task.title}
              </h3>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-all"
              title="Sửa công việc"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Xóa công việc"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className={`text-sm text-slate-500 mb-4 ml-8 ${
            task.completed ? 'line-through text-slate-400' : ''
          }`}>
            {task.description}
          </p>
        )}
      </div>

      {/* Metadata: Priority, Due Date */}
      <div className="pl-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs mt-auto">
        <span className={`px-2.5 py-0.5 rounded-full font-medium ${getPriorityBadge(task.priority)}`}>
          {getPriorityLabel(task.priority)}
        </span>

        <div className={`flex items-center gap-1.5 font-medium ${
          isOverdue() ? 'text-red-600' : 'text-slate-500'
        }`}>
          <Calendar size={14} />
          <span>Hạn chót: {formatDate(task.dueDate)}</span>
          {isOverdue() && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-1 bg-red-100 text-red-700 rounded ml-1">
              Trễ hạn
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
