
// Admin area with sidebar navigation to dashboard and stubs for other pages.
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Edit,
  Key,
} from "lucide-react";

const adminPages = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    route: "/admin/dashboard",
  },
  {
    label: "Manage Users",
    icon: Users,
    route: "#", // stub/placeholder
  },
  {
    label: "Events & Tour",
    icon: Calendar,
    route: "#", // stub/placeholder
  },
  {
    label: "Content Updates",
    icon: Edit,
    route: "#", // stub/placeholder
  },
];

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-circus-gold via-circus-cream to-white text-circus-dark">
      <Navbar />
      <main className="flex-grow flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-circus-cream/90 border-r-2 border-circus-gold flex flex-col p-6 md:min-h-[600px]">
          <div className="mb-10">
            <div className="flex items-center gap-2 font-circus text-xl text-circus-gold"><Key className="text-circus-gold" /> Administration</div>
          </div>
          <nav className="flex flex-col gap-3">
            {adminPages.map(page => (
              <button
                key={page.label}
                className="flex items-center gap-3 py-2 px-3 rounded-lg text-left font-alt hover:bg-circus-gold/20 transition"
                onClick={() => page.route !== "#" ? navigate(page.route) : alert('Stub page – coming soon.')}
              >
                <page.icon className="text-circus-gold" />
                <span>{page.label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto pt-16">
            <button
              className="text-sm text-circus-red hover:underline font-alt"
              onClick={() => navigate("/admin/login")}
            >
              Logout
            </button>
          </div>
        </aside>
        {/* Welcome panel */}
        <section className="flex-grow flex flex-col items-center justify-center px-4">
          <div className="bg-white/90 border-2 border-circus-gold rounded-xl shadow-xl max-w-3xl w-full p-10 text-center animate-fade-in">
            <h1 className="font-circus text-4xl text-circus-gold mb-4">Admin Dashboard</h1>
            <p className="font-alt mb-8 text-lg">
              Welcome to the administration dashboard! <br />
              Use the sidebar for management features.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-6">
              {adminPages.map(f => (
                <div
                  key={f.label}
                  className="flex flex-col items-center p-6 bg-circus-cream/90 rounded-lg border border-circus-gold hover:shadow-lg transition"
                >
                  <f.icon size={36} className="mb-3 text-circus-gold" />
                  <div className="font-circus text-xl mb-1">{f.label}</div>
                  <div className="font-alt text-circus-dark text-sm">More features coming soon!</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
