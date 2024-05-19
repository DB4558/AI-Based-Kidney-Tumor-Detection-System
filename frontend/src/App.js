import React from 'react';
import './App.css';
import { BrowserRouter as Router,Route, Routes } from 'react-router-dom';
import UserRegistrationForm from './user/userRegistration';
import LoginForm from './Login/login';
import UserHomePage from './user/UserHomePage';
import DoctorHome from './doctor/DoctorHome';
import ViewCase from './doctor/ViewCase';
import DoctorSuggestionsPage from './user/DoctorSuggesstionsPage';
function App() {
  return (
    <div className="App">
      <Router>
      <Routes>
      <Route exact path='/' element={<LoginForm/>} />
      <Route path="/view-case/:caseId" element={<ViewCase />} />
      <Route exact path='/doctor/doctor_home' element={<DoctorHome/>} />
      <Route exact path='/user/patient_home' element={<UserHomePage/>} />
      <Route exact path='/user/' element={<UserRegistrationForm/>} />
      <Route exact path='/user/registration' element={<UserRegistrationForm/>} />
      <Route exact path='/user/doctor-suggestions' element={<DoctorSuggestionsPage/>} />
      
      </Routes>
      </Router>
    </div>
  );
}
export default App;