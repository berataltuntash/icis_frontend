import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Components/Pages/LoginPage';
import ForgotPassword from './Components/Pages/ForgotPassword';
import ResetPassword from './Components/Pages/ResetPassword';
import IyteRegister from './Components/Pages/IyteRegister';
import CompanyRegister from './Components/Pages/CompanyRegister';
import StudentHomePage from './Components/Pages/StudentHomePage';
import CompanyHomePage from './Components/Pages/CompanyHomePage';
import StaffHomePage from './Components/Pages/StaffHomePage';
import PrivateRoute from './PrivateRoute';

function App() {

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/iyteregister" element={<IyteRegister/>} />
          <Route path="/companyregister" element={<CompanyRegister/>} />
          <Route path="/forgotpassword" element={<ForgotPassword/>} />
          <Route path="/resetpassword" element={<ResetPassword/>} />
          <Route  path="/studenthomepage" element={<StudentHomePage/>} />
          <Route  path="/companyhomepage" element={<CompanyHomePage/>} />
          <Route  path="/staffhomepage" element={<StaffHomePage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
