import logo from './logo.svg';
import './App.css';
import { Route, Router, Routes } from 'react-router-dom';
import Login from './Component/Login';
import AuthorDashboard from './Component/AuthorDashboard';
import MyBook from './Component/MyBook';
import MyTicket from './Component/MyTicket';
import CreateTicket from './Component/CreateTicket';
import AdminDashboard from './Component/AdminDashboard';
import TicketDetails from './Component/TicketDetails';
import CreateBook from './Component/CreateBook';
import Register from './Component/Register';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/author/dashboard' element={<AuthorDashboard />} />
        <Route path='/author/book' element={<MyBook />} />
        <Route path='/author/ticket' element={<MyTicket />} />
        <Route path='/author/createticket' element={<CreateTicket />} />
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path="/admin/tickets/:id" element={<TicketDetails />} />
        <Route path="/admin/books/create" element={<CreateBook />} />
      </Routes>
    </div>


  );
}

export default App;
