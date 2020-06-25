import React, { useState, useEffect } from 'react';
import PrivateRoute from '../components/PrivateRoutes/PrivateRoute';
import Navbar from '../components/Navbar';
import * as storageItem from '../configs/localStorageItems';

import jwtDecode from 'jwt-decode';
import 'antd/dist/antd.css';
import './App.css';



function App() {
  const [role, setRole] = useState('guest');

  const onLogOut = () => {
    localStorage.removeItem(storageItem.ACCESS_TOKEN);
    localStorage.setItem(storageItem.role, 'guest');
  }

  let token = localStorage.getItem(storageItem.ACCESS_TOKEN);
  let userInfo;

  if(token){
    userInfo = jwtDecode(token);
  } else {
    onLogOut();
  }

  return (
    <div className='App'>
      <PrivateRoute role={role} setRole={setRole} />
      <Navbar/>
    </div>
  );
}

export default App;
