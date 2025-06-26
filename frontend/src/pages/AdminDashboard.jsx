import React, { lazy, Suspense, useContext, useState } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  NavLink,
  useLocation,
} from "react-router-dom";
import {
  Settings,
  Users,
  FileText,
  Home,
  LogOut,
  Feather,
  FileDiffIcon,
  Edit,
  FileEdit,
  Edit2Icon,
  Edit3,
  EditIcon,
  Edit2,
} from "lucide-react";

// Admin Components
const OfficialsManager = lazy(() =>
  import("../reusableComponents/admin/OfficialsManager")
);
const ResourcesManager = lazy(() =>
  import("../reusableComponents/admin/ResourcesManager")
);
const SiteSettings = lazy(() =>
  import("../reusableComponents/admin/SiteSettings")
);
const EditRepresentative = lazy(() =>
  import("../reusableComponents/admin/EditRepresentative")
);
const AddRepresentative = lazy(() =>
  import("../reusableComponents/admin/AddRepresentative")
);
const AddResource = lazy(() =>
  import("../reusableComponents/admin/AddResource")
);
const EditResource = lazy(() => import("../reusableComponents/EditResource"));
const Feature = lazy(() => import("../reusableComponents/admin/Feature"));
const AddFeature = lazy(() =>
  import("../reusableComponents/admin/Feature/AddFeature")
);
const EditFeature = lazy(() =>
  import("../reusableComponents/admin/Feature/EditFeature")
);
const ManageAboutPage = lazy(() =>
  import("../reusableComponents/admin/ManageAboutPage")
);
const ManageHomePage = lazy(() =>
  import("../reusableComponents/admin/ManageHomePage")
);
const ManageResourcePage = lazy(() =>
  import("@/reusableComponents/admin/ManageResourcePage")
);
const NotFoundPage = lazy(() => import("./NotFoundPage"));
import { TokenContext } from "@/store/TokenContextProvider";
import LoadingScreen from "@/reusableComponents/LoadingScreen";

const AdminDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const { isAuthenticated, setIsAuthenticated } = useContext(TokenContext);
  if (!isAuthenticated) {
    return <div>Please log in to access the admin dashboard.</div>;
  }

  const navLinks = [
    {
      to: "/admin/representatives",
      label: "Representatives",
      icon: <Users size={20} className="mr-3" />,
    },
    {
      to: "/admin/resources",
      label: "Resources",
      icon: <FileText size={20} className="mr-3" />,
    },
    {
      to: "/admin/features",
      label: "Features",
      icon: <Feather size={20} className="mr-3" />,
    },
    {
      to: "/admin/home-page",
      label: "Manage Home Page",
      icon: <EditIcon size={20} className="mr-3" />,
    },
    {
      to: "/admin/aboutus-page",
      label: "Manage About Page",
      icon: <FileDiffIcon size={20} className="mr-3" />,
    },
    {
      to: "/admin/resource-page",
      label: "Manage Rescource Page",
      icon: <Edit2Icon size={20} className="mr-3" />,
    },
    {
      to: "/admin/settings",
      label: "Site Settings",
      icon: <Settings size={20} className="mr-3" />,
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="flex">
        {/* Sidebar for desktop */}
        <aside className="hidden md:flex flex-col w-64 min-h-screen bg-white shadow-md fixed">
          <div className="p-6 bg-blue-600">
            <h2 className="text-white text-lg font-bold">Admin Dashboard</h2>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-2 px-4">
              <li key="/admin">
                <NavLink
                  to="/admin"
                  end
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`
                  }
                >
                  <Home size={20} className="mr-3" />{" "}
                  <span>Dashboard Home</span>
                </NavLink>
              </li>
              {navLinks.map(({ to, label, icon }) => {
                return (
                  <li key={to}>
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        }`
                      }
                    >
                      {icon}
                      <span>{label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-gray-200 p-4">
            <button
              onClick={() => {
                navigate("/login");
                localStorage.removeItem("token");
                setIsAuthenticated(false);
              }}
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 w-full transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile menu button */}
        {!isMenuOpen && (
          <div className="md:hidden fixed top-4 left-4 z-20">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md bg-blue-600 text-white shadow-md"
            >
              {!isMenuOpen && <Menu size={24} />}
            </button>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden lg:hidden fixed inset-0 z-10 bg-gray-800 bg-opacity-75">
            <div className="bg-white w-64 h-full overflow-y-auto">
              <div className="p-6 bg-blue-600 flex justify-between items-center">
                <h2 className="text-white text-lg font-bold">
                  Admin Dashboard
                </h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white"
                >
                  <X size={24} />
                </button>
              </div>
              <nav className="py-4">
                <ul className="space-y-2 px-4">
                  <li key="/admin">
                    <NavLink
                      to="/admin"
                      end
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        }`
                      }
                    >
                      <Home size={20} className="mr-3" />{" "}
                      <span>Dashboard Home</span>
                    </NavLink>
                  </li>
                  {navLinks.map(({ to, label, icon }) => (
                    <li key={to}>
                      <NavLink
                        to={to}
                        className={({ isActive }) =>
                          `flex items-center px-4 py-3 rounded-lg transition-colors ${
                            isActive
                              ? "text-blue-600 bg-blue-50"
                              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          }`
                        }
                      >
                        {icon}
                        <span>{label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="border-t border-gray-200 p-4">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    localStorage.removeItem("token");
                    navigate("/login");
                  }}
                  className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 w-full"
                >
                  <LogOut size={20} className="mr-3" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 md:ml-64">
          <div className="container mx-auto">
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route
                  index
                  path="/"
                  element={
                    <div className="min-h-screen bg-white pt-0">
                      <div className="bg-gradient-to-r from-[#5f93e1] to-[#0844da] py-14 shadow-lg">
                        <div className="container mx-auto px-6">
                          <h1 className="text-4xl font-extrabold text-white text-center tracking-wide">
                            Welcome to the Admin Dashboard
                          </h1>
                          <p className="text-lg text-gray-300 text-center mt-3 max-w-2xl mx-auto">
                            Use the sidebar to navigate between different
                            sections.
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                        <DashboardCard
                          to="/admin/representatives"
                          icon={
                            <Users size={28} className="text-blue-700 mr-4" />
                          }
                          title="Representatives"
                          description="Manage official information and enhancements."
                          className="bg-blue-50"
                        />
                        <DashboardCard
                          to="/admin/resources"
                          icon={
                            <FileText
                              size={28}
                              className="text-emerald-700 mr-4"
                            />
                          }
                          title="Resources"
                          description="Add and edit resources for elected officials."
                          className="bg-emerald-50"
                        />
                        <DashboardCard
                          to="/admin/home-page"
                          icon={
                            <EditIcon
                              size={28}
                              className="text-amber-700 mr-4"
                            />
                          }
                          title="Home Page"
                          description="Edit the content of the Home page."
                          className="bg-amber-50"
                        />
                        <DashboardCard
                          to="/admin/aboutus-page"
                          icon={
                            <FileDiffIcon
                              size={28}
                              className="text-fuchsia-700 mr-4"
                            />
                          }
                          title="About Page"
                          description="Edit the content of the About Us page."
                          className="bg-fuchsia-50"
                        />
                        <DashboardCard
                          to="/admin/resource-page"
                          icon={
                            <Edit2Icon
                              size={28}
                              className="text-indigo-700 mr-4"
                            />
                          }
                          title="Resource Page"
                          description="Edit the content of the Resource page."
                          className="bg-indigo-50"
                        />
                        <DashboardCard
                          to="/admin/settings"
                          icon={
                            <Settings
                              size={28}
                              className="text-violet-700 mr-4"
                            />
                          }
                          title="Site Settings"
                          description="Configure site settings and appearance."
                          className="bg-violet-50"
                        />
                      </div>
                    </div>
                  }
                />

                <Route path="/representatives" element={<OfficialsManager />} />
                <Route
                  path="/representatives/:id"
                  element={<EditRepresentative />}
                />
                <Route
                  path="/representatives/new"
                  element={<AddRepresentative />}
                />
                <Route path="/resources" element={<ResourcesManager />} />
                <Route path="/resources/:id" element={<EditResource />} />
                <Route path="/resources/new" element={<AddResource />} />
                <Route path="/features" element={<Feature />} />
                <Route path="/features/new" element={<AddFeature />} />
                <Route path="/features/:id" element={<EditFeature />} />

                <Route path="/home-page" element={<ManageHomePage />} />
                <Route path="/aboutus-page" element={<ManageAboutPage />} />
                <Route path="/resource-page" element={<ManageResourcePage />} />

                <Route path="/settings" element={<SiteSettings />} />

                <Route
                  path="*"
                  element={
                    <NotFoundPage
                      to="/admin"
                      home="Back to Dashobard"
                      representatives={false}
                    />
                  }
                />
              </Routes>
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

// Dashboard card for main screen
const DashboardCard = ({ to, icon, title, description, className }) => (
  <Link
    to={to}
    className={`rounded-lg p-6 hover:shadow-md transition-shadow ${className}`}
  >
    <div className="flex items-center">
      {icon}
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
    <p className="text-gray-600 mt-2">{description}</p>
  </Link>
);

// Custom Icons
const Menu = ({ size }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const X = ({ size }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default AdminDashboard;
