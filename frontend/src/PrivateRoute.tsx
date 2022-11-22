import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';


function PrivateRoute() {
    const authenticated = window.sessionStorage.getItem('isLoggedIn') === "true"

    return authenticated ? <Outlet /> : <Navigate to="/signin" />;
}

export default PrivateRoute