import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';

const ShopSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { clear } = useCart();

  useEffect(() => {
    // Clear cart on successful purchase
    clear();
  }, [clear]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-circus-cream to-gray-50 text-circus-dark">
      <Navbar />
      <section className="container mx-auto px-4 py-12">
        <h1 className="font-circus text-4xl mb-4">Thank you for your purchase!</h1>
        <p className="font-alt mb-4">Your order is being processed. You'll receive an email confirmation shortly.</p>
        
        {orderId && (
          <div className="bg-white/80 p-4 rounded shadow max-w-md">
            <p className="font-bold mb-2">Order ID: {orderId}</p>
            <p className="text-sm text-gray-600">Save this ID to track your order.</p>
            <a href="/orders/track" className="text-circus-gold hover:underline">Track your order →</a>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default ShopSuccess;


