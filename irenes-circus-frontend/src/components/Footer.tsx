
import { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Youtube } from "lucide-react";
import { contactAPI } from "@/lib/api";

const Footer = () => {
  return (
    <footer className="bg-rock-black text-rock-cream py-16 border-t-4 border-rock-rust bg-grunge-overlay">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="mb-6">
              <h3 className="font-edgy text-3xl font-black text-rock-amber rock-text-shadow mb-2">
                IRENE'S
              </h3>
              <h4 className="font-rock text-xl font-bold text-rock-rust -mt-2">
                CIRCUS
              </h4>
            </div>
            <p className="font-hipster text-lg mb-6 text-rock-smoke">
              We make noice sometimes is music
            </p>
            <div className="flex gap-4">
              <a 
                href="https://linktr.ee/IrenesCircusTheBand?fbclid=PAb21jcANYyXlleHRuA2FlbQIxMQABp8PQoaKJ30X8zW8aUI8Vc24l42yy04Vj5x8Krb_NIJbI9aiB3AKZMDixJSJu_aem_Nt2nlTQvpXvtcidvvTtVKA" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-rock-cream"
                aria-label="Linktree"
                title="Linktree"
              >
                <div className="h-12 w-12 rounded-full border-2 border-rock-amber/50 bg-rock-charcoal flex items-center justify-center hover:bg-rock-amber hover:text-rock-black transition-colors duration-300">
                  <span className="text-xl">🌳</span>
                </div>
              </a>
              <a 
                href="https://www.instagram.com/irenescircustheband/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-rock-cream"
                aria-label="Instagram"
                title="Instagram"
              >
                <div className="h-12 w-12 rounded-full border-2 border-rock-amber/50 bg-rock-charcoal flex items-center justify-center hover:bg-rock-amber hover:text-rock-black transition-colors duration-300">
                  <Instagram size={22} />
                </div>
              </a>
              <a 
                href="https://youtube.com/@irenescircustheband?si=kKnlTsH2X3akowr4" 
                className="text-rock-cream"
                aria-label="YouTube"
                title="YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="h-12 w-12 rounded-full border-2 border-rock-amber/50 bg-rock-charcoal flex items-center justify-center hover:bg-rock-amber hover:text-rock-black transition-colors duration-300">
                  <Youtube size={22} />
                </div>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-rock text-2xl font-bold text-rock-amber mb-6 rock-text-shadow">
              QUICK LINKS
            </h3>
            <ul className="space-y-3 font-hipster text-lg">
              <li>
                <Link 
                  to="/" 
                  className="hover:text-rock-amber transition-colors duration-300 relative group"
                >
                  <span className="group-hover:animate-feedback">🏠 HOME</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/music" 
                  className="hover:text-rock-amber transition-colors duration-300 relative group"
                >
                  <span className="group-hover:animate-feedback">🎵 MUSIC</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/tour" 
                  className="hover:text-rock-amber transition-colors duration-300 relative group"
                >
                  <span className="group-hover:animate-feedback">🎸 TOUR DATES</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/gallery" 
                  className="hover:text-rock-amber transition-colors duration-300 relative group"
                >
                  <span className="group-hover:animate-feedback">📸 GALLERY</span>
                </Link>
              </li>
              
            </ul>
          </div>
          
          <div>
            <h3 className="font-rock text-2xl font-bold text-rock-amber mb-6 rock-text-shadow">
              CONTACT
            </h3>
            <div className="font-hipster text-lg mb-6 text-rock-smoke">
              <p className="mb-2">📧 Email: irenescircustheband@gmail.com</p>
              <p className="mb-4">🎤 Booking: irenescircustheband@gmail.com</p>
            </div>
            <FooterSubscribeForm />
          </div>
        </div>
        
        <div className="border-t-2 border-rock-rust mt-12 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="font-hipster text-rock-smoke">
              &copy; {new Date().getFullYear()} Irene's Circus. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 font-rock font-bold text-sm">
              <span className="text-rock-rust">LOUD</span>
              <span className="text-rock-amber">•</span>
              <span className="text-rock-rust">RAW</span>
              <span className="text-rock-amber">•</span>
              <span className="text-rock-rust">AUTHENTIC</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// Inline component for subscription to keep file organized
const FooterSubscribeForm = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailAddress) return;
    setIsSubmitting(true);
    setSubmitMessage(null);
    setSubmitError(null);
    try {
      await contactAPI.submitForm({
        name: "Newsletter Subscriber",
        email: emailAddress,
        subject: "Newsletter Subscription",
        message: "Please subscribe me to the newsletter."
      });
      setSubmitMessage("Subscribed!");
      setEmailAddress("");
    } catch (err: any) {
      setSubmitError(err?.message || "Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input 
        type="email" 
        placeholder="Join the rock revolution..." 
        className="w-full p-3 rounded-none bg-rock-charcoal border-2 border-rock-steel text-rock-cream placeholder-rock-smoke focus:border-rock-amber transition-colors duration-300 font-hipster"
        value={emailAddress}
        onChange={(e) => setEmailAddress(e.target.value)}
        required
        aria-label="Email address"
      />
      <button 
        type="submit" 
        disabled={isSubmitting}
        className={`bg-rust-gradient text-rock-cream px-6 py-3 rounded-none font-rock font-bold border-2 border-rock-amber hover:border-rock-rust transition-all duration-300 ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
        aria-label="Subscribe to newsletter"
      >
        {/* Circus icon added, removed blinking animation */}
        🎪 {isSubmitting ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
      </button>
      {submitMessage && (
        <p className="text-rock-amber text-sm">{submitMessage}</p>
      )}
      {submitError && (
        <p className="text-red-400 text-sm">{submitError}</p>
      )}
    </form>
  );
};
