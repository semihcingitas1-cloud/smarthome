import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { profile } from './redux/userSlice';

import Header from './layout/Header';
import Footer from './layout/Footer';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

import ControlPanel from './pages/ControlPanel';
import Devices from './pages/Devices';
import Automation from './pages/Automations';
import AIVoiceConfig from './pages/AIVoiceConfig';
import UserProfile from './pages/UserProfile';
import SpaceManager from './pages/SpaceMenager';

import Auth from './pages/Auth';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Guides from './pages/Guides';
import Scenarios from './pages/Scenarios';

import NotFound from './pages/NotFound';
import Maintenance from './pages/Maintenance';
import RelayControl from './pages/RelayControl';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) {

      dispatch(profile());
    }
  }, [dispatch]);

  return (

    <Router>

      <Header />

      <Routes>

        <Route exact path='/' element={<Home />} />
        <Route exact path='/dashboard' element={<Dashboard />} />
        <Route exact path='/devices' element={<Devices />} />
        <Route exact path='/automations' element={<Automation />} />
        <Route exact path='/aivoiceconfig' element={<AIVoiceConfig />} />
        <Route exact path='/userprofile' element={<UserProfile />} />
        <Route exact path='/controlpanel' element={<ControlPanel />} />
        <Route exact path='/spacemanager' element={<SpaceManager />} />

        <Route exact path='/auth' element={<Auth />} />
        <Route exact path='/forgot' element={<ForgotPassword />} />
        <Route exact path='/reset/:token' element={<ResetPassword />} />

        <Route exact path='/faq' element={<FAQ />} />
        <Route exact path='/contact' element={<Contact />} />
        <Route exact path='/guides' element={<Guides />} />
        <Route exact path='/scenarios' element={<Scenarios />} />

        <Route exact path='/*' element={<NotFound />} />
        <Route exact path='/maintenance' element={<Maintenance />} />

        <Route exact path='/relaycontrol' element={<RelayControl />} />

      </Routes>

      <Footer />

    </Router>

  );
}

export default App;