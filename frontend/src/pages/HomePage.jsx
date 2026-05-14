import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/shared/Navbar';
import SessionCard from '../components/shared/SessionCard';
import SearchBar from '../components/shared/SearchBar';
import CategoryFilter from '../components/shared/CategoryFilter';
import { Button } from '../components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../components/ui/pagination';
import data from '../data/data.json';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 6;

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 250]);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter sessions
  const filteredSessions = useMemo(() => {
    return data.sessions.filter((session) => {
      const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           session.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || session.category === selectedCategory;
      const matchesPrice = session.price >= priceRange[0] && session.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [searchQuery, selectedCategory, priceRange]);

  // Pagination
  const totalPages = Math.ceil(filteredSessions.length / ITEMS_PER_PAGE);
  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePriceChange = (range) => {
    setPriceRange(range);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]" data-testid="home-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl tracking-tight font-bold text-[#1A1A1A] mb-4">
              Discover Amazing Sessions
            </h1>
            <p className="text-base lg:text-lg text-[#737373] max-w-2xl mx-auto">
              Learn from experts, explore new skills, and book experiences that inspire you.
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-[#E5E5E5] mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
              <SearchBar 
                value={searchQuery} 
                onChange={handleSearchChange}
                placeholder="Search by session name..."
              />
            </div>
          </motion.div>

          {/* Category Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-8"
          >
            <CategoryFilter
              categories={data.categories}
              selected={selectedCategory}
              onChange={handleCategoryChange}
            />
          </motion.div>
        </div>
      </section>

      {/* Sessions Grid */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {paginatedSessions.length > 0 ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10"
                data-testid="sessions-grid"
              >
                {paginatedSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                  >
                    <SessionCard session={session} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center" data-testid="pagination">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          data-testid="pagination-prev"
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                            data-testid={`pagination-page-${page}`}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          data-testid="pagination-next"
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
              data-testid="no-results"
            >
              <p className="text-[#737373] text-lg mb-4">No sessions found matching your criteria.</p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setPriceRange([0, 250]);
                }}
                variant="outline"
                className="rounded-xl"
                data-testid="clear-filters"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section for Non-Authenticated Users */}
      {!isAuthenticated && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F5F0EB]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl tracking-tight font-semibold text-[#1A1A1A] mb-4">
              Ready to book your first session?
            </h2>
            <p className="text-[#737373] mb-8">
              Sign in to explore personalized recommendations and book amazing experiences.
            </p>
            <Button
              onClick={() => navigate('/auth')}
              className="bg-[#E05934] hover:bg-[#C94A28] text-white rounded-xl px-8 py-6 text-lg transition-all active:scale-95"
              data-testid="cta-login"
            >
              Get Started
            </Button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-[#737373]">
            © 2026 SessionHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;