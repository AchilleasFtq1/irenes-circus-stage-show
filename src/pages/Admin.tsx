
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LayoutDashboard, Users, Calendar, Edit } from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Dashboard Overview",
    description: "Monitor site metrics, updates, and manage main content.",
  },
  {
    icon: Users,
    title: "Manage Users",
    description: "Edit admin permissions, review contact submissions.",
  },
  {
    icon: Calendar,
    title: "Events & Tour",
    description: "Add, edit, or remove upcoming shows and releases.",
  },
  {
    icon: Edit,
    title: "Content Updates",
    description: "Upload images, update band info, and edit gallery.",
  },
];

const Admin = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-circus-gold via-circus-cream to-white text-circus-dark">
    <Navbar />
    <main className="flex-grow flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-white/90 border-2 border-circus-gold rounded-xl shadow-xl max-w-3xl w-full p-10 text-center animate-fade-in">
        <h1 className="font-circus text-4xl text-circus-gold mb-4">Admin Dashboard</h1>
        <p className="font-alt mb-8 text-lg">
          Welcome to the administration dashboard! <br />
          Use this page for future site management features.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex flex-col items-center p-6 bg-circus-cream/90 rounded-lg border border-circus-gold hover:shadow-lg hover-scale transition"
            >
              <f.icon size={36} className="mb-3 text-circus-gold" />
              <div className="font-circus text-xl mb-1">{f.title}</div>
              <div className="font-alt text-circus-dark text-sm">{f.description}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Admin;
