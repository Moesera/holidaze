import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import Layout from '../layout/Layout';
import Home from '../pages/home';
import Details from "../pages/details";
import Profile from "../pages/profile";
import Contact from '../pages/contact';
import RouteNotFound from "../pages/error";
import '../styles/App.css';

function App() {
  return (
    <HelmetProvider>
    <div className="App">
      <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="venue/:id" element={<Details />} />
        <Route path="profile/:name" element={<Profile />} />
        <Route path="contact/" element={<Contact />} />
        <Route path="*" element={<RouteNotFound />} />
        </Route>
      </Routes>
    </div>
    </HelmetProvider>
  );
}

export default App;
