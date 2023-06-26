import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={( <Login/> ) } />
      <Route path="/dashboard" element={(<Dashboard/>)} />
    </Routes>
   </BrowserRouter>
  )
}
