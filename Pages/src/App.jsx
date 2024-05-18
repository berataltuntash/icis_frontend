import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Components/AuthPages/LoginPage';
import IyteRegister from './Components/AuthPages/IyteRegister';
import CompanyRegister from './Components/AuthPages/CompanyRegister';
import ForgotPassword from './Components/AuthPages/ForgotPassword';
import ResetPassword from './Components/AuthPages/ResetPassword';
import StudentHomePage from './Components/StudentPages/StudentHomePage';
import CompanyHomePage from './Components/CompanyPages/CompanyHomePage';
import StaffHomePage from './Components/StaffPages/StaffHomePage';
import InternshipOpportunities from './Components/StudentPages/InternshipOpportunities';
import OpportunityDetail from './Components/StudentPages/OpportunityDetail';
import CreateInternshipAnnouncement from './Components/CompanyPages/CreateInternshipAnnouncement';

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
          <Route  path="/internshipopportunities" element={<InternshipOpportunities/>} />
          <Route  path="/opportunitydetail/:offerid" element={<OpportunityDetail/>} />
          <Route  path="/createinternshipannouncement" element={<CreateInternshipAnnouncement/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
