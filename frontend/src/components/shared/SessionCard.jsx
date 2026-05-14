import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const SessionCard = ({ session }) => {
  return (
    <Link 
      to={`/sessions/${session.id}`}
      className="group block"
      data-testid={`session-card-${session.id}`}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-3">
        <img
          src={session.image}
          alt={session.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
      </div>

      {/* Content */}
      <div className="space-y-1">
        {/* Title and Rating Row */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading font-semibold text-[#1A1A1A] text-base leading-tight line-clamp-1">
            {session.title}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="w-4 h-4 fill-[#1A1A1A] text-[#1A1A1A]" />
            <span className="text-sm font-medium text-[#1A1A1A]">{session.rating}</span>
          </div>
        </div>

        {/* Creator */}
        <p className="text-sm text-[#737373] line-clamp-1">
          {session.creator.name}
        </p>

        {/* Short Description */}
        <p className="text-sm text-[#737373] line-clamp-2">
          {session.shortDescription}
        </p>

        {/* Price */}
        <p className="text-[#1A1A1A] font-semibold pt-1">
          <span className="font-bold">${session.price}</span>
          <span className="font-normal text-[#737373]"> / session</span>
        </p>
      </div>
    </Link>
  );
};

export default SessionCard;