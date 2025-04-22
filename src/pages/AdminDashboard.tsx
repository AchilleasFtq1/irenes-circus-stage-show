
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Edit,
  Key
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const adminMenuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/admin/dashboard",
    active: true
  },
  {
    title: "Manage Users",
    icon: Users, 
    url: "#", // Placeholder
  },
  {
    title: "Events & Tour",
    icon: Calendar,
    url: "#", // Placeholder
  },
  {
    title: "Content Updates",
    icon: Edit,
    url: "#", // Placeholder
  }
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <SidebarProvider>
        <div className="flex flex-1 w-full">
          {/* Admin Sidebar */}
          <Sidebar className="border-r border-circus-gold/30">
            <div className="py-6 px-4 flex items-center gap-2">
              <Key className="text-circus-gold" size={20} />
              <span className="font-circus text-xl text-circus-gold">Administration</span>
            </div>
            <SidebarContent>
              <SidebarMenu>
                {adminMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      isActive={item.active}
                      onClick={() => item.url !== "#" ? navigate(item.url) : alert("Coming soon!")}
                      className="hover:bg-circus-cream/50 data-[active=true]:bg-circus-cream/70 text-circus-dark"
                    >
                      <item.icon className="text-circus-gold" size={20} />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="pb-8">
              <button
                onClick={() => navigate('/admin/login')}
                className="flex items-center text-circus-red hover:underline font-alt mx-4"
              >
                Logout
              </button>
            </SidebarFooter>
          </Sidebar>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <div className="max-w-5xl mx-auto">
              <h1 className="font-circus text-4xl text-circus-gold mb-4">Admin Dashboard</h1>
              <p className="font-alt text-lg mb-8 text-circus-dark">
                Welcome to the administration dashboard!
                <br />
                Use the sidebar for management features.
              </p>
              
              {/* Feature Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {adminMenuItems.map((feature) => (
                  <div
                    key={feature.title}
                    className="border border-circus-gold rounded-xl overflow-hidden bg-circus-cream/20 hover:shadow-md transition-all"
                  >
                    <div className="p-6 flex flex-col items-center text-center">
                      <feature.icon size={50} className="text-circus-gold mb-4" />
                      <h3 className="font-circus text-2xl mb-2 text-circus-dark">{feature.title}</h3>
                      <p className="font-alt text-circus-dark">More features coming soon!</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AdminDashboard;
