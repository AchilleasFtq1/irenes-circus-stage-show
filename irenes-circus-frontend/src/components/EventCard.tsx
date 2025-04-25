import { Calendar } from "lucide-react";
import { IEvent } from "@/lib/types";

const EventCard = ({ event, className = "" }: { event: IEvent, className?: string }) => {
  const dateObj = new Date(event.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className={`border border-circus-cream/20 rounded-lg overflow-hidden hover:border-circus-gold transition-all duration-300 group ${className}`}>
      <div className="flex flex-col md:flex-row">
        <div className="bg-circus-dark p-4 md:w-36 flex flex-row md:flex-col items-center justify-center gap-2">
          <Calendar className="text-circus-gold" />
          <span className="font-circus text-circus-gold text-xl font-bold">
            {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
        
        <div className="flex-1 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-circus-dark">
          <div>
            <h3 className="font-circus text-xl font-bold text-circus-dark">{event.venue}</h3>
            <p className="font-alt text-sm text-circus-dark/80">
              {event.city}, {event.country}
            </p>
          </div>
          
          {event.ticketLink && !event.isSoldOut ? (
            <a 
              href={event.ticketLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-circus-gold text-circus-dark px-4 py-2 rounded font-bold hover:bg-circus-red hover:text-circus-cream transition-colors"
            >
              Get Tickets
            </a>
          ) : event.isSoldOut ? (
            <span className="bg-circus-red/80 text-circus-cream px-4 py-2 rounded font-bold opacity-80">
              Sold Out
            </span>
          ) : (
            <span className="bg-circus-blue text-circus-cream px-4 py-2 rounded font-bold">
              Coming Soon
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
