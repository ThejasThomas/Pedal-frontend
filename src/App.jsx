import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UserRoute from './routes/userRoute';
import AdminRoute from './routes/adminRoute';
import HomePage from './pages/user/home/home';
import ErrorPage from './pages/user/UserPages/errorpage'
import './App.css';

function App() {
  return (
    <Router> 
      <Routes>
      <Route path="/" element={<HomePage />} />
        <Route path="/user/*" element={<UserRoute />} />
        <Route path="/admin/*" element={<AdminRoute />} />
        <Route path='/*' element ={<ErrorPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
