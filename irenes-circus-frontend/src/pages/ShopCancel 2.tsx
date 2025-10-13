import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ShopCancel = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-circus-cream to-gray-50 text-circus-dark">
      <Navbar />
      <section className="container mx-auto px-4 py-12">
        <h1 className="font-circus text-4xl mb-4">Payment canceled</h1>
        <p className="font-alt">Your checkout was canceled. You can try again anytime.</p>
      </section>
      <Footer />
    </div>
  );
};

export default ShopCancel;


