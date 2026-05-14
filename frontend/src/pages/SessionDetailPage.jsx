import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, ArrowLeft, User } from 'lucide-react';
import Navbar from '../components/shared/Navbar';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useAuth } from '../context/AuthContext';
import data from '../data/data.json';
import { Toaster, toast } from 'sonner';

const SessionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const session = data.sessions.find((s) => s.id === id);

  if (!session) {
    return (
      <div className="min-h-screen bg-[#FAF9F6]" data-testid="session-not-found">
        <Navbar />
        <div className="pt-24 px-4 text-center">
          <h1 className="text-2xl font-bold text-[#1A1A1A] mb-4">Session Not Found</h1>
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="rounded-xl"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    toast.success('Booking confirmed!', {
      description: `You have successfully booked "${session.title}"`,
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]" data-testid="session-detail-page">
      <Navbar />
      <Toaster position="top-right" richColors />

      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              className="text-[#737373] hover:text-[#1A1A1A] rounded-xl"
              data-testid="back-button"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden rounded-3xl aspect-[16/10]"
              >
                <img
                  src={session.image}
                  alt={session.title}
                  className="w-full h-full object-cover"
                  data-testid="session-image"
                />
              </motion.div>

              {/* Session Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 text-sm text-[#737373]">
                  <span className="px-3 py-1 bg-[#F5F0EB] rounded-full">{session.category}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {session.duration}
                  </span>
                </div>

                <h1 
                  className="font-heading text-3xl sm:text-4xl font-bold text-[#1A1A1A]"
                  data-testid="session-title"
                >
                  {session.title}
                </h1>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-[#1A1A1A] text-[#1A1A1A]" />
                    <span className="font-semibold text-[#1A1A1A]">{session.rating}</span>
                    <span className="text-[#737373]">({session.reviewCount} reviews)</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5E5E5]">
                  <h2 className="font-heading text-xl font-semibold text-[#1A1A1A] mb-3">
                    About this session
                  </h2>
                  <p 
                    className="text-[#737373] leading-relaxed"
                    data-testid="session-description"
                  >
                    {session.description}
                  </p>
                </div>
              </motion.div>

              {/* Creator Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="pt-6 border-t border-[#E5E5E5]"
              >
                <h2 className="font-heading text-xl font-semibold text-[#1A1A1A] mb-4">
                  Meet your host
                </h2>
                <div 
                  className="flex items-center gap-4"
                  data-testid="creator-info"
                >
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={session.creator.avatar} alt={session.creator.name} />
                    <AvatarFallback className="bg-[#E05934] text-white text-xl">
                      {session.creator.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-[#1A1A1A] text-lg">{session.creator.name}</h3>
                    <p className="text-[#737373]">{session.creator.title}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Booking Widget */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="sticky top-24 bg-white rounded-3xl border border-[#E5E5E5] shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-6"
                data-testid="booking-widget"
              >
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-[#1A1A1A]">${session.price}</span>
                    <span className="text-[#737373]">/ session</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-5 h-5 text-[#737373]" />
                    <span className="text-[#1A1A1A]">Duration: {session.duration}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <User className="w-5 h-5 text-[#737373]" />
                    <span className="text-[#1A1A1A]">Hosted by {session.creator.name}</span>
                  </div>
                </div>

                <Button
                  onClick={handleBookNow}
                  className="w-full bg-[#E05934] hover:bg-[#C94A28] text-white rounded-xl py-6 text-lg font-semibold transition-all active:scale-95"
                  data-testid="book-now-button"
                >
                  {isAuthenticated ? 'Book Now' : 'Sign in to Book'}
                </Button>

                {!isAuthenticated && (
                  <p className="text-center text-sm text-[#737373] mt-4">
                    You need to sign in to book this session
                  </p>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SessionDetailPage;