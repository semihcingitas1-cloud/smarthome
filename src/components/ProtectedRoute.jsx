/**
 * @param {object}   props
 * @param {object}   props.user             - Redux auth state'inden gelen kullanıcı
 * @param {boolean}  props.loading          - Auth kontrol sürüyor mu?
 * @param {string[]} [props.allowedRoles]   - Bu rotaya girebilecek roller. Ör: ['admin', 'moderator']
 * @param {string}   [props.minRole]        - Bu rolden büyük/eşit herkese izin ver. Ör: 'editor'
 * @param {string}   [props.redirectPath]   - Giriş yapılmamışsa yönlendirilecek sayfa
 * @param {string}   [props.unauthorizedPath] - Rol yetersizse yönlendirilecek sayfa
 */
import React, { useMemo, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { parseToken } from "../utils/tokenUtils";
import { hasRole, hasMinRole } from "../utils/roles";

const ProtectedRoute = ({ user, loading, allowedRoles, minRole, redirectPath = "/auth", unauthorizedPath = "/unauthorized" }) => {

  const location = useLocation();

  const token = localStorage.getItem("token");

  const { isValid: tokenIsValid, isExpired } = useMemo(() => {

    return parseToken(token);
  }, [token]);

  useEffect(() => {

    if (token && (!tokenIsValid || isExpired)) {

      localStorage.removeItem("token");
    }
  }, [token, tokenIsValid, isExpired]);

  const isAuthorized = useMemo(() => {

    if (!allowedRoles?.length && !minRole) return true;
    if (!user) return false;
    if (allowedRoles?.length) return hasRole(user, allowedRoles);
    if (minRole) return hasMinRole(user, minRole);
    return false;
  }, [user, allowedRoles, minRole]);

  console.log({ token, tokenIsValid, isExpired, user, loading });

  if (loading) {

    return (

      <div className="flex flex-col justify-center items-center h-screen gap-4">

        <div className="w-12 h-12 rounded-full border-4 border-gray-100 border-t-blue-500 animate-spin" />
        <p className="text-gray-500 animate-pulse font-medium">Oturum kontrol ediliyor...</p>

      </div>
    );
  }

  if (!token) {

    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (!tokenIsValid || isExpired) {

    return (

      <Navigate to={redirectPath} state={{ from: location, sessionExpired: true, message: "Oturumunuzun süresi dolmuş. Lütfen tekrar giriş yapın."}} replace/>
    );
  }

  if (!user) {

    return (

      <div className="flex flex-col justify-center items-center h-screen gap-4">

        <div className="w-12 h-12 rounded-full border-4 border-gray-100 border-t-rose-500 animate-spin" />
        <p className="text-gray-500 animate-pulse font-medium">Yükleniyor...</p>

      </div>
    );
  }

  if (!isAuthorized) {

    return (

      <Navigate to={unauthorizedPath} state={{ from: location, reason: allowedRoles?.length ? `Bu sayfaya yalnızca şu roller erişebilir: ${allowedRoles.join(", ")}.` : `Bu sayfaya erişmek için en az "${minRole}" rolü gereklidir.` }} replace/>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;