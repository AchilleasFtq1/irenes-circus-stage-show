
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-circus-cream to-white text-circus-dark">
      <Navbar />

      <main className="flex flex-col items-center justify-center flex-1 py-16 px-4">
        <div className="flex flex-col items-center">
          <img 
            src="/lovable-uploads/fe5985cf-a00a-4e1f-9fcc-4dfb55611ee7.png"
            alt="Irene's Circus Logo"
            className="w-32 h-32 mb-6 rounded-full shadow-lg border-4 border-circus-gold"
            style={{ background: "#fff" }}
          />
          <h1 className="font-circus text-4xl font-bold mb-2 text-circus-red">Contact Us</h1>
          <p className="font-alt text-circus-dark text-lg mb-8 text-center max-w-xl">
            Have a question, booking inquiry, or just want to say hello? Fill out the form below and we'll get in touch soon!
          </p>
        </div>
        <div className="w-full max-w-xl bg-white/90 rounded-xl shadow-lg border border-circus-gold p-8 backdrop-blur-md">
          <ContactForm />
        </div>
      </main>

      <Footer />
    </div>
  )
};

export default Contact;
