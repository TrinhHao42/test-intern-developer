import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Filter, Search, Calendar } from 'lucide-react';
import { setSearch, setCompletedFilter, setDueDateFilter, setPriorityFilter } from '../../store/taskSlice';

export default function Sidebar() {
  const dispatch = useDispatch();
  const { items: tasks, filters } = useSelector(state => state.tasks);
  const { search, completedFilter, dueDateFilter, priorityFilter } = filters;

  const [localSearch, setLocalSearch] = React.useState(search);
  const debounceTimeoutRef = React.useRef(null);

  // Sync local search state with Redux search value (e.g. when cleared)
  React.useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleSearchChange = (value) => {
    setLocalSearch(value);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      dispatch(setSearch(value));
    }, 400);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-5">
        <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
          <Filter size={18} className="text-indigo-500" />
          Bộ lọc & Tìm kiếm
        </h3>

        {/* Search Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Từ khóa</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm tên, mô tả..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={localSearch}
              onChange={e => handleSearchChange(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">Trạng thái</label>
          <div className="flex flex-col gap-1">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'active', label: 'Chưa hoàn thành' },
              { id: 'completed', label: 'Đã hoàn thành' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => dispatch(setCompletedFilter(item.id))}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  completedFilter === item.id 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Độ ưu tiên</label>
          <div className="flex flex-col gap-1">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'LOW', label: 'Thấp (Low)' },
              { id: 'MEDIUM', label: 'Trung bình (Medium)' },
              { id: 'HIGH', label: 'Cao (High)' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => dispatch(setPriorityFilter(item.id))}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  priorityFilter === item.id 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Due Date Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hạn chót</label>
          <div className="relative">
            <input
              type="date"
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={dueDateFilter}
              onChange={e => dispatch(setDueDateFilter(e.target.value))}
            />
            <Calendar className="absolute left-3 top-2.5 text-slate-400" size={16} />
          </div>
          {dueDateFilter && (
            <button
              onClick={() => dispatch(setDueDateFilter(''))}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Xóa lọc ngày
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats Widget */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl p-5 shadow-md">
        <h4 className="font-bold text-lg mb-2">Tiến độ công việc</h4>
        <div className="text-3xl font-extrabold mb-1">
          {completedCount} / {totalCount}
        </div>
        <p className="text-indigo-100 text-xs">Công việc đã được hoàn thành</p>
        
        <div className="w-full bg-white/20 h-1.5 rounded-full mt-4 overflow-hidden">
          <div 
            className="bg-white h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
