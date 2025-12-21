import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Calendar, ChevronLeft, ChevronRight, FileText, TrendingUp } from 'lucide-react';

interface JournalHistoryProps {
  entries: any[];
  onClose: () => void;
  onViewEntry: (entry: any) => void;
  onViewWeeklySummary: () => void;
}

export function JournalHistory({ entries, onClose, onViewEntry, onViewWeeklySummary }: JournalHistoryProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getEntryForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return entries.find(entry => entry.date === dateStr);
  };

  const getEntryStatus = (entry: any) => {
    if (!entry) return null;
    
    // Determine status based on entry content
    if (entry.observations.some((o: string) => ['pest', 'disease', 'unusual'].includes(o))) {
      return 'issue'; // Red
    }
    if (entry.activities.length > 0 && entry.activities[0] !== 'no-work') {
      return 'work'; // Green
    }
    if (entry.observations.length > 0) {
      return 'observation'; // Yellow
    }
    return 'no-work'; // Gray
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'work':
        return 'bg-green-500';
      case 'observation':
        return 'bg-yellow-500';
      case 'issue':
        return 'bg-red-500';
      case 'no-work':
        return 'bg-gray-400';
      default:
        return 'bg-transparent';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl p-6 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <div>
            <h3 className="text-xl text-foreground mb-1">Journal History</h3>
            <p className="text-sm text-muted-foreground">View your past entries</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <button
            onClick={onViewWeeklySummary}
            className="flex items-center justify-center gap-2 py-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm">Weekly Summary</span>
          </button>
          <button className="flex items-center justify-center gap-2 py-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
            <FileText className="w-5 h-5" />
            <span className="text-sm">Season Report</span>
          </button>
        </div>

        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={previousMonth}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <div className="text-lg font-medium text-foreground">
              {monthNames[month]} {year}
            </div>
          </div>

          <button
            onClick={nextMonth}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="mb-6">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const entry = getEntryForDate(day);
              const status = getEntryStatus(entry);
              const today = new Date();
              const isToday =
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();

              return (
                <button
                  key={day}
                  onClick={() => entry && onViewEntry(entry)}
                  disabled={!entry}
                  className={`aspect-square rounded-lg border transition-all relative ${
                    isToday
                      ? 'border-primary border-2'
                      : 'border-border'
                  } ${
                    entry
                      ? 'hover:border-primary/50 cursor-pointer bg-muted'
                      : 'cursor-default'
                  }`}
                >
                  <div className="text-sm text-foreground">{day}</div>
                  {status && (
                    <div
                      className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full ${getStatusColor(
                        status
                      )}`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="p-4 bg-muted rounded-lg">
          <div className="text-sm font-medium text-foreground mb-3">Legend:</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-muted-foreground">Work Done</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-muted-foreground">Observation Only</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-muted-foreground">Issue Logged</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400" />
              <span className="text-muted-foreground">No Work</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="p-3 bg-green-500/10 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">
              {entries.filter(e => getEntryStatus(e) === 'work').length}
            </div>
            <div className="text-xs text-muted-foreground">Work Days</div>
          </div>
          <div className="p-3 bg-yellow-500/10 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {entries.filter(e => getEntryStatus(e) === 'observation').length}
            </div>
            <div className="text-xs text-muted-foreground">Observations</div>
          </div>
          <div className="p-3 bg-red-500/10 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">
              {entries.filter(e => getEntryStatus(e) === 'issue').length}
            </div>
            <div className="text-xs text-muted-foreground">Issues</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
