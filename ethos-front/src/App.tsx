import './App.css'
import { Routes, Route, Navigate } from "react-router-dom"
import Ethos from './pages/Ethos';
import ApiProvider from './context/ApiProvider';
// import About from './pages/About';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegistePage';
import UserPage from './pages/UserPage';
import ProjectPage from './pages/ProjectPage';
import BlogPage from './pages/BlogPage';


import { FlashProvider } from './context/FlashProvider';
import { UserProvider } from './context/UserProvider';

import AdminRoute from './components/AdminRoute';
import PublicRoute from './components/PrivateRoute';
import PrivateRoute from './components/PrivateRoute';
import AdminPage from './pages/Admin/AdminPage';
import UpdateProject from './pages/UpdateProject';
import ProjectsPage from './pages/ProjectsPage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import UpdateTechnologies from './pages/UpdateTechnologies';
import UpdateTesting from './pages/UpdateTestingDetails';


function App() {
  return (
    <>
        <FlashProvider>
          <ApiProvider>
             <UserProvider>
              
                <Routes>
                  <Route path="/ethos" element={ <Ethos />} />
                  <Route path="/login" element={
                    <LoginPage />
                  } />
                  <Route path="/project/:id" element={ <ProjectPage />} />
                  <Route path="/blog" element={ <BlogPage />} />
                  <Route path="/services" element={ <ServicesPage />} />
                  <Route path="/about" element={ <AboutPage />} />

                  <Route path="/projects" element={ <ProjectsPage />} />  
                  <Route path="/project/:id/update" element={ <UpdateProject />} />
                  <Route path="/project/:id/update/technologies" element={ <UpdateTechnologies />} />
                  <Route path="/project/:id/update/testings" element={ <UpdateTesting />} />



                  <Route path="/logout" element={
                    <PublicRoute><Ethos /></PublicRoute>
                  } />

                  <Route path="/register" element={<RegisterPage />
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
                        {/* <Route path="/" element={<Ethos />} /> */}

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
