import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { ROUTE_ROLES } from "./utils/roles";

import { profile, setLoading } from './redux/userSlice';

import ProtectedRoute from "./components/ProtectedRoute";

import Header from './layout/Header';
import Footer from './layout/Footer';

import Home from './pages/Home';

import Products from './pages/Shopping/Products';
import ProductDetail from './pages/Shopping/ProductDetail';
import PricingPage from './pages/Shopping/PricingPage';
import QuoteCalculator from './pages/Shopping/QuoteCalculator';
import Cart from './pages/Shopping/Cart';
import Favorite from './pages/Shopping/Favorite';

import Auth from './pages/Auth/Auth';
import AuthSuccess from './pages/Auth/AuthSuccess';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Guides from './pages/Guides';
import Scenarios from './pages/Scenarios';

import Dashboard from './pages/User/Dashboard';
import ControlPanel from './pages/User/ControlPanel';
import Devices from './pages/User/Devices';
import Automation from './pages/User/Automations';
import AIVoiceConfig from './pages/User/AIVoiceConfig';
import UserProfile from './pages/User/UserProfile';
import SpaceManager from './pages/User/SpaceMenager';
import Help from './pages/User/Help';

import PaymentPage from './pages/Payment/PaymentPage';
import PaymentSuccess from './pages/Payment/PaymentSuccess';

import EditorDashboard from './pages/Editor/EditorDashboard';
import EditorMessage from './pages/Editor/EditorMessage';
import EditorOrders from './pages/Editor/EditorOrders';
import EditorQR from './pages/Editor/EditorQR';

import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProduct from './pages/Admin/AdminProduct';
import AdminAddProduct from './pages/Admin/AdminAddProduct';
import AdminUpdateProduct from './pages/Admin/AdminUpdateProduct';
import AdminMessage from './pages/Admin/AdminMessage';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminBilling from './pages/Admin/AdminBilling';
import AdminDevices from './pages/Admin/AdminDevices';
import AdminLogs from './pages/Admin/AdminLogs';
import AdminSettings from './pages/Admin/AdminSettings';

import NotFound from './pages/NotFound';
import Maintenance from './pages/Maintenance';
import UnauthorizedPage from './pages/Unauthorized';

import SmartHomePanel from './pages/SmartHomePanel';
import Test from './pages/Test';

function App() {

  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.user);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) {

      dispatch(profile());
    } else {

      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const isMaintenance = false;
  if (isMaintenance && user?.user?.role !== 'admin') {return <Maintenance />;}

  const routeProps = { user, loading };

  return (

    <Router>

      <Header />

      <Routes>

        <Route exact path='/' element={<Home />} />

        <Route exact path='/products' element={<Products />} />
        <Route exact path='/productdetail/:slug' element={<ProductDetail />} />
        <Route exact path='/pricing' element={<PricingPage />} />
        <Route exact path='/QuoteCalculator' element={<QuoteCalculator />} />
        <Route exact path='/cart' element={<Cart />} />
        <Route exact path='/favorite' element={<Favorite />} />

        <Route exact path='/auth' element={<Auth />} />
        <Route exact path="/auth/success" element={<AuthSuccess />} />
        <Route exact path='/forgot' element={<ForgotPassword />} />
        <Route exact path='/reset/:token' element={<ResetPassword />} />

        <Route exact path='/faq' element={<FAQ />} />
        <Route exact path='/contact' element={<Contact />} />
        <Route exact path='/guides' element={<Guides />} />
        <Route exact path='/scenarios' element={<Scenarios />} />

        <Route element={<ProtectedRoute {...routeProps} redirectPath='/auth' />}>

          <Route exact path='/user/dashboard' element={<Dashboard />} />
          <Route exact path='/user/devices' element={<Devices />} />
          <Route exact path='/user/automations' element={<Automation />} />
          <Route exact path='/user/userprofile' element={<UserProfile />} />
          <Route exact path='/user/controlpanel' element={<ControlPanel />} />
          <Route exact path='/user/spacemanager' element={<SpaceManager />} />
          <Route exact path='/user/aivoiceconfig' element={<AIVoiceConfig />} />

          <Route exact path='/help' element={<Help />} />

          <Route exact path='/payment' element={<PaymentPage />} />
          <Route exact path='/paymentsuccess' element={<PaymentSuccess />} />

        </Route>

        <Route element={<ProtectedRoute {...routeProps} minRole="moderator" /> }>

          <Route path="/editor/dashboard" element={<EditorDashboard />} />
          <Route path="/editor/message" element={<EditorMessage />} />
          <Route path="/editor/orders" element={<EditorOrders />} />
          <Route exact path='/editor/qrcode' element={<EditorQR />} />

        </Route>

        <Route element={<ProtectedRoute {...routeProps} allowedRoles={ROUTE_ROLES.ADMIN_ONLY}/> }>

          <Route exact path='/admin/dashboard' element={<AdminDashboard />} />
          <Route exact path='/admin/product' element={<AdminProduct />} />
          <Route exact path='/admin/addproduct' element={<AdminAddProduct />} />
          <Route exact path='/admin/updateproduct/:id' element={<AdminUpdateProduct />} />
          <Route exact path='/admin/message' element={<AdminMessage />} />
          <Route exact path='/admin/users' element={<AdminUsers />} />
          <Route exact path='/admin/billing' element={<AdminBilling />} />
          <Route exact path='/admin/devices' element={<AdminDevices />} />
          <Route exact path='/admin/logs' element={<AdminLogs />} />
          <Route exact path='/admin/settings' element={<AdminSettings />} />

        </Route>

        <Route exact path='/*' element={<NotFound />} />
        <Route exact path='/maintenance' element={<Maintenance />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route exact path='/smarthomepanel' element={<SmartHomePanel />} />
        <Route exact path='/test/:slug' element={<Test />} />

      </Routes>

      <Footer />

    </Router>

  );
}

export default App;
