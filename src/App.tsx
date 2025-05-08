

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import  RoomsPage from './pages/Rooms'
import Auth from './pages/Auth'
import FeedbackBoard from './components/FeedBackBoard' 
import PrivateRoute  from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Auth />} />

        <Route 
          path="/rooms" 
          element={
            <PrivateRoute>
              <RoomsPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/feedback" 
          element={
            <PrivateRoute>
              <FeedbackBoard />
            </PrivateRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}
export default App
