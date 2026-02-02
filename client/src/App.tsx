import { Route, Router } from "@solidjs/router";
import { lazy } from "solid-js";
import { Layout } from "./components/common/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { FlashProvider } from "./contexts/FlashContext";
import "./styles.css";

// Lazy load pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const EduVisit = lazy(() => import("./pages/EduVisit"));
const Book = lazy(() => import("./pages/Book"));
const Hotels = lazy(() => import("./pages/Hotels"));
const HotelDetail = lazy(() => import("./pages/HotelDetail"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Profile = lazy(() => import("./pages/Profile"));
const Admin = lazy(() => import("./pages/Admin"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));
const CheckoutCancelled = lazy(() => import("./pages/CheckoutCancelled"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <Router
      root={(props) => (
        <AuthProvider>
          <FlashProvider>
            <Layout>{props.children}</Layout>
          </FlashProvider>
        </AuthProvider>
      )}
    >
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/edu-visit" component={EduVisit} />
      <Route path="/book" component={Book} />
      <Route path="/hotels" component={Hotels} />
      <Route path="/hotels/:id" component={HotelDetail} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/profile" component={Profile} />
      <Route path="/admin/*" component={Admin} />
      <Route path="/checkout/success" component={CheckoutSuccess} />
      <Route path="/checkout/cancelled" component={CheckoutCancelled} />
      <Route path="*" component={NotFound} />
    </Router>
  );
}

export default App;
