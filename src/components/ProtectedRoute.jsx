import React, { useMemo } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ isAdmin = false, user, loading, redirectPath = '/auth', adminRedirectPath = '/admin/dashboardadmin' }) => {

    const location = useLocation();
    const token = localStorage.getItem('token');

    const isAuthorized = useMemo(() => {

        if (!isAdmin) return true;
        return user?.user?.role === 'admin' || user?.role === 'admin';
    }, [isAdmin, user]);

    if (loading) {

        return (

            <div className="flex flex-col justify-center items-center h-screen gap-4">

                <div className="w-12 h-12 rounded-full border-4 border-gray-100 border-t-rose-500 animate-spin"></div>
                <p className="text-gray-500 animate-pulse font-medium">Oturum kontrol ediliyor...</p>

            </div>
        );
    }

    if (!token) {

        return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }

    if (!isAuthorized) {

        return <Navigate to={adminRedirectPath} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;