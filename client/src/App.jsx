import { Navigate, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Nav from "./components/Nav";
import Profile from "./pages/Profile";
import Protect from "./utils/Protect";
import Watch from "./pages/Watch";
import Users from "./pages/Users";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Shop from "./pages/Shop";
import Contact from "./pages/Contact";

import { Toaster } from 'sonner';

import About from "./pages/ABout";
import Admin from "./pages/Admin";
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from "./context/AuthContext";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const App = () => {
  const { user, loading } = useAuth();

  if(loading) return (
    <div className="flex justify-center items-center h-screen">
      <Spinner className="w-10 h-10" />
    </div>
  );

  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Protect><Profile /></Protect>} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/watches/:id" element={<Watch />} />
        <Route path="/users" element={user?.role === 'admin' ? <Users /> : <Navigate to='/' />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
        <Route path="/admin" element={user?.role === 'admin' ? <Admin /> : <Navigate to='/' />} />
      </Routes>

      <Toaster position="top-left" />
    </>
  );
};

export default App;