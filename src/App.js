import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { profile } from './redux/userSlice';

import ProtectedRout from './components/ProtectedRoute';

import Header from './layout/Header';
import Footer from './layout/Footer';

import Home from './pages/Home';

import Products from './pages/Shopping/Products';
import ProductDetail from './pages/Shopping/ProductDetail';

import Auth from './pages/Auth';
import AuthSuccess from './pages/AuthSuccess';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

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

import AdminProduct from './pages/Admin/AdminProduct';
import AdminAddProduct from './pages/Admin/AdminAddProduct';
import AdminSettings from './pages/Admin/AdminSettings';

import NotFound from './pages/NotFound';
import Maintenance from './pages/Maintenance';
import SmartHomePanel from './pages/SmartHomePanel';

function App() {

  const dispatch = useDispatch();


  const { user, isAuth } = useSelector(state => state.user);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) {

      dispatch(profile());
    }
  }, [dispatch]);

  const isMaintenance = false;
  if (isMaintenance && user?.user?.role !== 'admin') {return <Maintenance />;}

  return (

    <Router>

      <Header />

      <Routes>

        <Route exact path='/' element={<Home />} />

        <Route exact path='/products' element={<Products />} />
        <Route exact path='/productdetail' element={<ProductDetail />} />

        <Route exact path='/auth' element={<Auth />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route exact path='/forgot' element={<ForgotPassword />} />
        <Route exact path='/reset/:token' element={<ResetPassword />} />

        <Route exact path='/faq' element={<FAQ />} />
        <Route exact path='/contact' element={<Contact />} />
        <Route exact path='/guides' element={<Guides />} />
        <Route exact path='/scenarios' element={<Scenarios />} />

        <Route element={<ProtectedRout isAdmin={false} user={user} />}>

          <Route exact path='/user/dashboard' element={<Dashboard />} />
          <Route exact path='/user/devices' element={<Devices />} />
          <Route exact path='/user/automations' element={<Automation />} />
          <Route exact path='/user/aivoiceconfig' element={<AIVoiceConfig />} />
          <Route exact path='/user/userprofile' element={<UserProfile />} />
          <Route exact path='/user/controlpanel' element={<ControlPanel />} />
          <Route exact path='/user/spacemanager' element={<SpaceManager />} />

        </Route>

        <Route element={<ProtectedRout isAdmin={false} user={user} />}>

          <Route exact path='/admin/product' element={<AdminProduct />} />
          <Route exact path='/admin/addproduct' element={<AdminAddProduct />} />
          <Route exact path='/admin/settings' element={<AdminSettings />} />

        </Route>

        <Route exact path='/*' element={<NotFound />} />
        <Route exact path='/maintenance' element={<Maintenance />} />

        <Route exact path='/smarthomepanel' element={<SmartHomePanel />} />

      </Routes>

      <Footer />

    </Router>

  );
}

export default App;