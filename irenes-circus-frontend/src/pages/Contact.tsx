import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { contactAPI } from '@/lib/api';

const Contact = () => {
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleFormSubmit = async (formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      await contactAPI.submitForm(formData);
      
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitError('Failed to send your message. Please try again later.');
      setSubmitSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-circus-cream to-white text-circus-dark">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <h1 className="font-circus text-4xl md:text-5xl font-bold text-center mb-8 text-circus-gold">
          Contact Us
        </h1>
        
        <div className="max-w-2xl mx-auto">
          {submitSuccess ? (
            <div className="bg-green-100 text-green-800 p-6 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-4">Message Sent!</h2>
              <p className="mb-6">
                Thank you for contacting Irene's Circus. We'll get back to you as soon as possible.
              </p>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="bg-circus-gold text-circus-dark px-6 py-3 rounded-lg font-bold hover:bg-circus-red hover:text-circus-cream transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <ContactForm 
              onSubmit={handleFormSubmit} 
              error={submitError}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
