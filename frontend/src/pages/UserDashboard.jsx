import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, ArrowRight, BookOpen, CalendarCheck, CheckCircle2, LayoutGrid, List, X } from 'lucide-react';
import Navbar from '../components/shared/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import data from '../data/data.json';
import { format } from 'date-fns';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'active', 'past'
  const [viewMode, setViewMode] = useState('list'); // 'list', 'grid'
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/auth', { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E05934]"></div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  // Get user bookings from static data
  const userBookings = data.bookings.filter((booking) => booking.userId === user.id);
  const activeBookings = userBookings.filter((b) => b.status === 'active');
  const pastBookings = userBookings.filter((b) => b.status === 'past');

  // Filter bookings based on active filter
  const getFilteredBookings = () => {
    switch (activeFilter) {
      case 'active':
        return activeBookings;
      case 'past':
        return pastBookings;
      default:
        return userBookings;
    }
  };

  const filteredBookings = getFilteredBookings();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Stats card data with icons
  const statsCards = [
    {
      id: 'all',
      label: 'Total Bookings',
      value: userBookings.length,
      icon: BookOpen,
      color: 'text-[#1A1A1A]',
      bgColor: 'bg-[#F5F0EB]',
    },
    {
      id: 'active',
      label: 'Upcoming Sessions',
      value: activeBookings.length,
      icon: CalendarCheck,
      color: 'text-[#E05934]',
      bgColor: 'bg-[#E05934]/10',
    },
    {
      id: 'past',
      label: 'Completed',
      value: pastBookings.length,
      icon: CheckCircle2,
      color: 'text-[#3A824A]',
      bgColor: 'bg-[#3A824A]/10',
    },
  ];

  // Booking card component for list view
  const BookingCardList = ({ booking, isPast }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white rounded-2xl border border-[#E5E5E5] p-4 flex flex-col sm:flex-row gap-4 hover:-translate-y-1 transition-transform cursor-pointer",
        isPast && "opacity-70 hover:opacity-100"
      )}
      onClick={() => navigate(`/sessions/${booking.sessionId}`)}
      data-testid={`booking-${booking.id}`}
    >
      <img
        src={booking.sessionImage}
        alt={booking.sessionTitle}
        className={cn("w-full sm:w-32 h-24 object-cover rounded-xl", isPast && "grayscale")}
      />
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-[#1A1A1A]">{booking.sessionTitle}</h4>
          <Badge className={cn(
            "border-0 rounded-full",
            isPast ? "bg-[#F5F0EB] text-[#737373]" : "bg-[#3A824A]/10 text-[#3A824A]"
          )}>
            {isPast ? 'Completed' : 'Active'}
          </Badge>
        </div>
        <div className="flex items-center gap-4 mt-2 text-sm text-[#737373]">
          <span className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" />
            {formatDate(booking.date)}
          </span>
          <span className={cn("font-medium", isPast ? "text-[#737373]" : "text-[#1A1A1A]")}>
            ${booking.price}
          </span>
        </div>
      </div>
      <ArrowRight className="w-5 h-5 text-[#737373] self-center hidden sm:block" />
    </motion.div>
  );

  // Booking card component for grid view
  const BookingCardGrid = ({ booking, isPast }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden hover:-translate-y-1 transition-transform cursor-pointer",
        isPast && "opacity-70 hover:opacity-100"
      )}
      onClick={() => navigate(`/sessions/${booking.sessionId}`)}
      data-testid={`booking-grid-${booking.id}`}
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={booking.sessionImage}
          alt={booking.sessionTitle}
          className={cn("w-full h-full object-cover", isPast && "grayscale")}
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-semibold text-[#1A1A1A] line-clamp-1">{booking.sessionTitle}</h4>
          <Badge className={cn(
            "border-0 rounded-full text-xs",
            isPast ? "bg-[#F5F0EB] text-[#737373]" : "bg-[#3A824A]/10 text-[#3A824A]"
          )}>
            {isPast ? 'Done' : 'Active'}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-[#737373]">
            <CalendarIcon className="w-4 h-4" />
            {format(new Date(booking.date), 'MMM d, yyyy')}
          </span>
          <span className={cn("font-semibold", isPast ? "text-[#737373]" : "text-[#1A1A1A]")}>
            ${booking.price}
          </span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6]" data-testid="user-dashboard">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl border border-[#E5E5E5] p-8 mb-8"
            data-testid="profile-section"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-[#E05934] text-white text-2xl">
                  {user.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left flex-1">
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
                  {user.name}
                </h1>
                <p className="text-[#737373] mt-1">{user.email}</p>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-4">
                  <Badge variant="secondary" className="bg-[#F5F0EB] text-[#1A1A1A] rounded-full">
                    {userBookings.length} Bookings
                  </Badge>
                  <Badge variant="secondary" className="bg-[#3A824A]/10 text-[#3A824A] rounded-full">
                    {activeBookings.length} Active
                  </Badge>
                </div>
              </div>
              {/* Date Range Picker */}
              <div className="flex flex-col items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[280px] justify-start text-left font-normal rounded-xl border-[#E5E5E5]",
                        !dateRange.from && "text-[#737373]"
                      )}
                      data-testid="date-range-picker-trigger"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-[#E05934]" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")}
                          </>
                        ) : (
                          format(dateRange.from, "MMM d, yyyy")
                        )
                      ) : (
                        "Select date range"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {(dateRange.from || dateRange.to) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDateRange({ from: undefined, to: undefined })}
                    className="text-xs text-[#737373] hover:text-[#D94436]"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Clear dates
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Stats Cards - Clickable with Mobile Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex gap-2 sm:gap-4 mb-8"
          >
            {statsCards.map((stat) => {
              const isActive = activeFilter === stat.id;
              return (
                <motion.div
                  key={stat.id}
                  onClick={() => setActiveFilter(stat.id)}
                  layout
                  initial={false}
                  animate={{
                    flex: isActive ? 1 : 'none',
                  }}
                  transition={{
                    layout: { duration: 0.3, ease: "easeInOut" },
                  }}
                  className={cn(
                    "bg-white rounded-2xl border-2 cursor-pointer transition-colors",
                    "p-3 sm:p-6",
                    isActive 
                      ? "border-[#E05934] shadow-lg flex-1" 
                      : "border-[#E5E5E5] hover:border-[#E05934]/50 w-14 sm:w-auto sm:flex-1"
                  )}
                  data-testid={`stat-card-${stat.id}`}
                >
                  {/* Mobile: Icon only for non-active, full content for active */}
                  {/* Desktop: Always show full content */}
                  <div className="sm:hidden">
                    {isActive ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={cn("p-1.5 rounded-lg", stat.bgColor)}>
                            <stat.icon className={cn("w-4 h-4", stat.color)} />
                          </div>
                          <span className="text-xs text-[#737373] truncate">{stat.label}</span>
                        </div>
                        <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
                        <motion.p 
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[10px] text-[#E05934] mt-1 font-medium"
                        >
                          Currently viewing
                        </motion.p>
                      </motion.div>
                    ) : (
                      <div className="flex items-center justify-center h-full min-h-[60px]">
                        <div className={cn("p-2 rounded-xl", stat.bgColor)}>
                          <stat.icon className={cn("w-5 h-5", stat.color)} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Desktop: Always full content */}
                  <div className="hidden sm:block">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={cn("p-2 rounded-xl", stat.bgColor)}>
                        <stat.icon className={cn("w-5 h-5", stat.color)} />
                      </div>
                      <span className="text-sm text-[#737373]">{stat.label}</span>
                    </div>
                    <p className={cn("text-3xl font-bold", stat.color)}>{stat.value}</p>
                    {isActive && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-[#E05934] mt-2 font-medium"
                      >
                        Currently viewing
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Bookings List Header with View Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-semibold text-[#1A1A1A]">
                  {activeFilter === 'all' && 'All Bookings'}
                  {activeFilter === 'active' && 'Upcoming Sessions'}
                  {activeFilter === 'past' && 'Completed Sessions'}
                </h2>
                <p className="text-sm text-[#737373] mt-1">
                  {filteredBookings.length} session{filteredBookings.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-[#F5F0EB] rounded-xl p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "rounded-lg px-3",
                    viewMode === 'list' ? "bg-white shadow-sm" : "hover:bg-white/50"
                  )}
                  data-testid="view-list-btn"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "rounded-lg px-3",
                    viewMode === 'grid' ? "bg-white shadow-sm" : "hover:bg-white/50"
                  )}
                  data-testid="view-grid-btn"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {filteredBookings.length > 0 ? (
              viewMode === 'list' ? (
                <div className="space-y-4" data-testid="bookings-list">
                  {filteredBookings.map((booking) => (
                    <BookingCardList
                      key={booking.id}
                      booking={booking}
                      isPast={booking.status === 'past'}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="bookings-grid">
                  {filteredBookings.map((booking) => (
                    <BookingCardGrid
                      key={booking.id}
                      booking={booking}
                      isPast={booking.status === 'past'}
                    />
                  ))}
                </div>
              )
            ) : (
              <div 
                className="bg-white rounded-2xl border border-[#E5E5E5] p-12 text-center"
                data-testid="no-bookings"
              >
                <Clock className="w-12 h-12 text-[#737373] mx-auto mb-4" />
                <h3 className="font-semibold text-[#1A1A1A] mb-2">
                  {activeFilter === 'all' && 'No bookings yet'}
                  {activeFilter === 'active' && 'No upcoming sessions'}
                  {activeFilter === 'past' && 'No completed sessions'}
                </h3>
                <p className="text-[#737373] mb-6">
                  {activeFilter === 'all' && 'Explore our sessions and book your first experience!'}
                  {activeFilter === 'active' && 'Book a session to see it here.'}
                  {activeFilter === 'past' && 'Your completed sessions will appear here.'}
                </p>
                {activeFilter === 'all' && (
                  <Button
                    onClick={() => navigate('/')}
                    className="bg-[#E05934] hover:bg-[#C94A28] text-white rounded-xl transition-all active:scale-95"
                    data-testid="explore-sessions"
                  >
                    Explore Sessions
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;