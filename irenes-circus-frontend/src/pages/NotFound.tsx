
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-circus-cream to-white text-circus-dark flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="font-circus text-6xl md:text-8xl font-bold mb-4 text-circus-red">404</h1>
          <p className="font-circus text-2xl md:text-4xl text-circus-dark mb-6">The Show Isn't Here</p>
          <p className="font-alt text-lg md:text-xl max-w-lg mx-auto mb-8">
            It seems you've wandered off the main stage. Let's get you back to the performance!
          </p>
          <Link 
            to="/" 
            className="bg-circus-gold text-circus-dark px-6 py-3 rounded-lg font-bold inline-block hover:bg-circus-red hover:text-circus-cream transition-colors"
          >
            Return to Main Stage
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFound;
