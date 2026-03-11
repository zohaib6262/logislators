import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext, lazy } from "react";
import { TokenContext } from "./store/TokenContextProvider";
import withSuspense from "./utils/withSuspense";

// Lazy components
// Previous Home page (commented out – revert by uncommenting below and commenting SchoolFinder)
// const HomePage = lazy(() => import("./pages/HomePage"));
const SchoolFinder = lazy(() => import("./pages/SchoolFinder"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage"));
const Legislators = lazy(() => import("./pages/Legislators"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const AddressForm = lazy(() => import("./pages/CreateAccount"));
const RepresentativeDetails = lazy(() =>
  import("./reusableComponents/RepresentativeDetails")
);
const SearchRepresentative = lazy(() => import("./pages/SearchRepresentative"));
const SchoolsResults = lazy(() => import("./pages/SchoolsResults"));
const SchoolDetails = lazy(() => import("./pages/SchoolDetails"));
const AddSchool = lazy(() => import("./pages/AddSchool"));
const PublicLayout = lazy(() => import("./pages/PublicLayout"));
const NotFoundAdmin = lazy(() => import("./reusableComponents/NotFoundAdmin"));
function App() {
  const { isAuthenticated } = useContext(TokenContext);

  return (
    <Router>
      <Routes>
        <Route path="/" element={withSuspense(PublicLayout)}>
          <Route index element={withSuspense(SchoolFinder)} />
          {/* <Route index element={withSuspense(HomePage)} /> */}
          <Route
            path="representatives"
            element={withSuspense(SearchRepresentative)}
          />
          <Route
            path="representative/:id"
            element={withSuspense(RepresentativeDetails)}
          />
          <Route path="about" element={withSuspense(AboutPage)} />
          <Route path="resources" element={withSuspense(ResourcesPage)} />
          <Route path="voting-records" element={withSuspense(Legislators)} />
          <Route path="schools" element={withSuspense(SchoolsResults)} />
          <Route path="schools/:id" element={withSuspense(SchoolDetails)} />
          <Route path="add-school" element={withSuspense(AddSchool)} />
          <Route
            path="*"
            element={withSuspense(() => (
              <NotFoundPage
                to="/"
                home="Back to Home"
                representatives={false}
              />
            ))}
          />
        </Route>

        <Route
          path="/admin/*"
          element={withSuspense(
            isAuthenticated ? AdminDashboard : NotFoundAdmin
          )}
        />
        <Route path="/login" element={withSuspense(LoginPage)} />
      </Routes>
    </Router>
  );
}

export default App;
