import './App.css'
import { Routes, Route, Navigate } from "react-router-dom"
import Ethos from './pages/Ethos';
import ApiProvider from './context/ApiProvider';
// import About from './pages/About';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegistePage';
import UserPage from './pages/UserPage';


import { FlashProvider } from './context/FlashProvider';
import { UserProvider } from './context/UserProvider';

import AdminRoute from './components/AdminRoute';
import PublicRoute from './components/PrivateRoute';
import PrivateRoute from './components/PrivateRoute';
import AdminPage from './pages/Admin/AdminPage';


function App() {
  return (
    <>
        <FlashProvider>
          <ApiProvider>
            <UserProvider>
              
              
                <Routes>
                  <Route path="/" element={
                    <PublicRoute><Ethos /></PublicRoute>
                  } />
                  <Route path="/login" element={
                    <PublicRoute><LoginPage /></PublicRoute>
                  } />
                  <Route path="/logout" element={
                    <PublicRoute><Ethos /></PublicRoute>
                  } />
                  <Route path="/register" element={
                    <PublicRoute><RegisterPage /></PublicRoute>
                  } />
                  


                  <Route path="/admin/*" element={
                    <AdminRoute>
                      <Routes>
                        <Route path='/' element={<AdminPage />} />
                        <Route path='/shipping' /> 
                        
                        {/* <Route path='/edit/:id' element={<EditProductPage />} /> */}


                      </Routes>
                    </AdminRoute> 
                  }/>
          
                  <Route path="*" element={
                    <PrivateRoute>
                      <Routes>
                        <Route path="/" element={<Ethos />} />

                        {/* <Route path='/shipping' /> */}
                        <Route path="/user" element={<UserPage />} />
                        <Route path="*" element={<Navigate to="/" />} />
                      </Routes>
                    </PrivateRoute>
                  } />                  
                </Routes>
              
            </UserProvider>

          </ApiProvider>
        </FlashProvider>  
       
    </>
  )
}

export default App;
