import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Users, DollarSign, Star, LayoutGrid, List, Calendar as CalendarIcon, Layers, X } from 'lucide-react';
import Navbar from '../components/shared/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import data from '../data/data.json';
import { Toaster, toast } from 'sonner';
import { format } from 'date-fns';

const CreatorDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isCreator, loading } = useAuth();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [activeFilter, setActiveFilter] = useState('sessions'); // 'sessions', 'bookings', 'revenue', 'rating'
  const [viewMode, setViewMode] = useState('grid'); // 'list', 'grid'
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    category: '',
  });

  // Redirect if not authenticated or not a creator
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate('/auth', { replace: true });
      } else if (!isCreator) {
        navigate('/dashboard/user', { replace: true });
      }
    }
  }, [loading, isAuthenticated, isCreator, navigate]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E05934]"></div>
      </div>
    );
  }

  // Don't render if not authenticated or not a creator
  if (!isAuthenticated || !user || !isCreator) {
    return null;
  }

  // Get creator's sessions
  const creatorSessions = data.sessions.filter((session) =>
    user.sessionsCreated?.includes(session.id)
  );

  // Get bookings for creator's sessions
  const creatorBookings = data.bookings.filter((b) =>
    creatorSessions.some((s) => s.id === b.sessionId)
  );

  // Calculate stats
  const totalBookings = creatorBookings.length;
  const totalRevenue = creatorSessions.reduce((sum, s) => sum + s.price, 0) * totalBookings / creatorSessions.length || 0;
  const avgRating = creatorSessions.reduce((sum, s) => sum + s.rating, 0) / creatorSessions.length || 0;

  // Stats card data with icons
  const statsCards = [
    {
      id: 'sessions',
      label: 'Total Sessions',
      value: creatorSessions.length,
      icon: Layers,
      color: 'text-[#1A1A1A]',
      bgColor: 'bg-[#F5F0EB]',
    },
    {
      id: 'bookings',
      label: 'Total Bookings',
      value: totalBookings,
      icon: Users,
      color: 'text-[#E05934]',
      bgColor: 'bg-[#E05934]/10',
    },
    {
      id: 'revenue',
      label: 'Est. Revenue',
      value: `$${Math.round(totalRevenue)}`,
      icon: DollarSign,
      color: 'text-[#3A824A]',
      bgColor: 'bg-[#3A824A]/10',
    },
    {
      id: 'rating',
      label: 'Avg. Rating',
      value: avgRating.toFixed(1),
      icon: Star,
      color: 'text-[#D49827]',
      bgColor: 'bg-[#D49827]/10',
    },
  ];

  // Get content based on active filter
  const getFilterContent = () => {
    switch (activeFilter) {
      case 'bookings':
        return { type: 'bookings', data: creatorBookings, title: 'Session Bookings' };
      case 'revenue':
        return { type: 'sessions', data: creatorSessions, title: 'Revenue by Session' };
      case 'rating':
        return { type: 'sessions', data: [...creatorSessions].sort((a, b) => b.rating - a.rating), title: 'Sessions by Rating' };
      default:
        return { type: 'sessions', data: creatorSessions, title: 'Your Sessions' };
    }
  };

  const filterContent = getFilterContent();

  const handleCreate = () => {
    toast.success('Session created!', {
      description: 'Your new session has been added successfully.',
    });
    setShowCreateDialog(false);
    setFormData({ title: '', description: '', price: '', duration: '', category: '' });
  };

  const handleEdit = (session) => {
    setSelectedSession(session);
    setFormData({
      title: session.title,
      description: session.description,
      price: session.price.toString(),
      duration: session.duration,
      category: session.category,
    });
    setShowEditDialog(true);
  };

  const handleUpdate = () => {
    toast.success('Session updated!', {
      description: 'Your changes have been saved.',
    });
    setShowEditDialog(false);
    setSelectedSession(null);
  };

  const handleDelete = (session) => {
    setSelectedSession(session);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    toast.success('Session deleted!', {
      description: `"${selectedSession?.title}" has been removed.`,
    });
    setShowDeleteDialog(false);
    setSelectedSession(null);
  };

  // Session card for grid view
  const SessionCardGrid = ({ session }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden hover:-translate-y-1 transition-transform"
      data-testid={`session-item-${session.id}`}
    >
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={session.image}
          alt={session.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-[#1A1A1A] line-clamp-1">{session.title}</h3>
          <Badge className="bg-[#F5F0EB] text-[#1A1A1A] border-0 rounded-full text-xs">
            {session.category}
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-sm text-[#737373] mb-4">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-[#D49827] text-[#D49827]" />
            {session.rating}
          </span>
          <span className="font-semibold text-[#1A1A1A]">${session.price}</span>
          <span>{session.duration}</span>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => handleEdit(session)}
            variant="outline"
            size="sm"
            className="flex-1 rounded-xl"
            data-testid={`edit-session-${session.id}`}
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(session)}
            variant="outline"
            size="sm"
            className="rounded-xl text-[#D94436] hover:text-[#D94436] hover:bg-[#D94436]/10"
            data-testid={`delete-session-${session.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );

  // Session card for list view
  const SessionCardList = ({ session }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-[#E5E5E5] p-4 flex flex-col sm:flex-row gap-4 hover:-translate-y-1 transition-transform"
      data-testid={`session-list-${session.id}`}
    >
      <img
        src={session.image}
        alt={session.title}
        className="w-full sm:w-40 h-28 object-cover rounded-xl"
      />
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-[#1A1A1A]">{session.title}</h3>
          <Badge className="bg-[#F5F0EB] text-[#1A1A1A] border-0 rounded-full text-xs">
            {session.category}
          </Badge>
        </div>
        <p className="text-sm text-[#737373] line-clamp-2 mb-2">{session.shortDescription}</p>
        <div className="flex items-center gap-4 text-sm text-[#737373]">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-[#D49827] text-[#D49827]" />
            {session.rating} ({session.reviewCount})
          </span>
          <span className="font-semibold text-[#1A1A1A]">${session.price}</span>
          <span>{session.duration}</span>
        </div>
      </div>
      <div className="flex sm:flex-col gap-2 justify-end">
        <Button
          onClick={() => handleEdit(session)}
          variant="outline"
          size="sm"
          className="rounded-xl"
          data-testid={`edit-list-session-${session.id}`}
        >
          <Edit2 className="w-4 h-4 sm:mr-1" />
          <span className="hidden sm:inline">Edit</span>
        </Button>
        <Button
          onClick={() => handleDelete(session)}
          variant="outline"
          size="sm"
          className="rounded-xl text-[#D94436] hover:text-[#D94436] hover:bg-[#D94436]/10"
          data-testid={`delete-list-session-${session.id}`}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );

  // Booking card for grid view
  const BookingCardGrid = ({ booking }) => {
    const session = data.sessions.find(s => s.id === booking.sessionId);
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden hover:-translate-y-1 transition-transform"
        data-testid={`booking-grid-${booking.id}`}
      >
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={booking.sessionImage}
            alt={booking.sessionTitle}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-[#1A1A1A] line-clamp-1 mb-2">{booking.sessionTitle}</h3>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-[#737373]">
              <CalendarIcon className="w-4 h-4" />
              {format(new Date(booking.date), 'MMM d, yyyy')}
            </span>
            <Badge className={cn(
              "border-0 rounded-full text-xs",
              booking.status === 'active' ? "bg-[#3A824A]/10 text-[#3A824A]" : "bg-[#F5F0EB] text-[#737373]"
            )}>
              {booking.status === 'active' ? 'Upcoming' : 'Completed'}
            </Badge>
          </div>
          <p className="text-sm font-semibold text-[#1A1A1A] mt-2">${booking.price}</p>
        </div>
      </motion.div>
    );
  };

  // Booking card for list view
  const BookingCardList = ({ booking }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-[#E5E5E5] p-4 flex flex-col sm:flex-row gap-4 hover:-translate-y-1 transition-transform"
      data-testid={`booking-list-${booking.id}`}
    >
      <img
        src={booking.sessionImage}
        alt={booking.sessionTitle}
        className="w-full sm:w-32 h-24 object-cover rounded-xl"
      />
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-[#1A1A1A]">{booking.sessionTitle}</h4>
          <Badge className={cn(
            "border-0 rounded-full",
            booking.status === 'active' ? "bg-[#3A824A]/10 text-[#3A824A]" : "bg-[#F5F0EB] text-[#737373]"
          )}>
            {booking.status === 'active' ? 'Upcoming' : 'Completed'}
          </Badge>
        </div>
        <div className="flex items-center gap-4 mt-2 text-sm text-[#737373]">
          <span className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" />
            {format(new Date(booking.date), 'MMM d, yyyy')}
          </span>
          <span className="font-medium text-[#1A1A1A]">${booking.price}</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6]" data-testid="creator-dashboard">
      <Navbar />
      <Toaster position="top-right" richColors />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
          >
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-[#E05934] text-white text-xl">
                  {user.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
                  Creator Dashboard
                </h1>
                <p className="text-[#737373]">{user.title || 'Session Creator'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Date Range Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[260px] justify-start text-left font-normal rounded-xl border-[#E5E5E5]",
                      !dateRange.from && "text-[#737373]"
                    )}
                    data-testid="creator-date-range-picker"
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
                      "Filter by date range"
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
                  className="text-xs text-[#737373] hover:text-[#D94436] rounded-xl"
                >
                  <X className="w-3 h-3 mr-1" />
                  Clear
                </Button>
              )}
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-[#E05934] hover:bg-[#C94A28] text-white rounded-xl transition-all active:scale-95"
                data-testid="create-session-button"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Session
              </Button>
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

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-semibold text-[#1A1A1A]">
                  {filterContent.title}
                </h2>
                <p className="text-sm text-[#737373] mt-1">
                  {filterContent.data.length} {filterContent.type === 'bookings' ? 'booking' : 'session'}{filterContent.data.length !== 1 ? 's' : ''}
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
                  data-testid="creator-view-list-btn"
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
                  data-testid="creator-view-grid-btn"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {filterContent.data.length > 0 ? (
              filterContent.type === 'sessions' ? (
                viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="sessions-grid">
                    {filterContent.data.map((session) => (
                      <SessionCardGrid key={session.id} session={session} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4" data-testid="sessions-list">
                    {filterContent.data.map((session) => (
                      <SessionCardList key={session.id} session={session} />
                    ))}
                  </div>
                )
              ) : (
                viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="bookings-grid">
                    {filterContent.data.map((booking) => (
                      <BookingCardGrid key={booking.id} booking={booking} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4" data-testid="bookings-list">
                    {filterContent.data.map((booking) => (
                      <BookingCardList key={booking.id} booking={booking} />
                    ))}
                  </div>
                )
              )
            ) : (
              <div 
                className="bg-white rounded-2xl border border-[#E5E5E5] p-12 text-center"
                data-testid="no-content"
              >
                <Plus className="w-12 h-12 text-[#737373] mx-auto mb-4" />
                <h3 className="font-semibold text-[#1A1A1A] mb-2">
                  {filterContent.type === 'bookings' ? 'No bookings yet' : 'No sessions yet'}
                </h3>
                <p className="text-[#737373] mb-6">
                  {filterContent.type === 'bookings' 
                    ? 'Bookings will appear here when users book your sessions.'
                    : 'Create your first session and start sharing your expertise!'}
                </p>
                {filterContent.type === 'sessions' && (
                  <Button
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-[#E05934] hover:bg-[#C94A28] text-white rounded-xl transition-all active:scale-95"
                  >
                    Create Your First Session
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Create Session Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[500px]" data-testid="create-dialog">
          <DialogHeader>
            <DialogTitle className="font-heading">Create New Session</DialogTitle>
            <DialogDescription>
              Fill in the details for your new session.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Design Masterclass"
                data-testid="input-title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your session..."
                rows={3}
                data-testid="input-description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="99"
                  data-testid="input-price"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 2 hours"
                  data-testid="input-duration"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Design, Wellness"
                data-testid="input-category"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              className="bg-[#E05934] hover:bg-[#C94A28] text-white"
              data-testid="submit-create"
            >
              Create Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Session Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]" data-testid="edit-dialog">
          <DialogHeader>
            <DialogTitle className="font-heading">Edit Session</DialogTitle>
            <DialogDescription>
              Update your session details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                data-testid="edit-input-title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                data-testid="edit-input-description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price ($)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  data-testid="edit-input-price"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duration</Label>
                <Input
                  id="edit-duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  data-testid="edit-input-duration"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              className="bg-[#E05934] hover:bg-[#C94A28] text-white"
              data-testid="submit-edit"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[400px]" data-testid="delete-dialog">
          <DialogHeader>
            <DialogTitle className="font-heading text-[#D94436]">Delete Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedSession?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-[#D94436] hover:bg-[#B93327] text-white"
              data-testid="confirm-delete"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatorDashboard;