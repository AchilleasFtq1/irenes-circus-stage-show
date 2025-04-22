
import Navbar from "@/components/Navbar";

const AdminDashboard = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-circus-gold via-circus-cream to-white">
    <Navbar />
    <main className="flex flex-col items-center justify-center flex-grow">
      <div className="bg-white/90 shadow-xl border-2 border-circus-gold rounded-xl max-w-2xl w-full px-12 py-10 mt-16">
        <h1 className="font-circus text-3xl text-circus-gold mb-4">Dashboard</h1>
        <p className="font-alt text-lg mb-4">
          Welcome to the administrator dashboard.
        </p>
        <p className="font-alt text-circus-dark">
          Here you'll manage events, music, users, and more (features coming soon).
        </p>
      </div>
    </main>
  </div>
);

export default AdminDashboard;
