
import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// contexts
import CartProvider from "./contexts/cart";
import UserProvider from "./contexts/user";

// components
import Header from './components/shared/header';
import Footer from './components/shared/footer';
import Home from './components/home';
import Dashboard from './components/dashboard/index';
import EditFarmer from './components/dashboard/farmer/editFarmer';
import EditProduct from './components/dashboard/product/editProduct';
import Product from './components/product';
import Checkout from './components/checkout';
import CheckoutSuccess from './components/checkout/result/success';
import Agritourism from './components/agritourism';
import DashboardAgritourism from './components/dashboard/agritourism/Overview';
import AboutUs from './components/about';
import NotFound from './components/not-found';
import DashboardHeader from './components/dashboard/header';
import DashboardLogIn from './components/dashboard/logIn';

function App() {
  const currentPath = window.location.pathname

  return (
    <CartProvider>
    <UserProvider>
      <Router>
        <main>
          <Routes>
            <Route path='dashboard' element={<DashboardHeader />}>
              <Route exact path='/dashboard' element={< Dashboard />}></Route>
              <Route exact path='/dashboard/product/:id' element={< EditProduct />}></Route>
              <Route exact path='/dashboard/farmer/:id' element={< EditFarmer />}></Route>
            </Route>
            <Route path='/' element={<Header />}>
              <Route exact path='/' element={< Home />}></Route>
              <Route exact path='/product/:id' element={< Product />}></Route>
              <Route exact path='/agritourism/:id' element={< Agritourism />}></Route>
              <Route exact path='/cart' element={< Checkout />}></Route>
              <Route exact path='/checkout/success/:orderId' element={<CheckoutSuccess />}></Route>
              <Route exact path='/about' element={<AboutUs />}></Route>
              <Route exact path='/login' element={<DashboardLogIn />}></Route>
              <Route path="*" element={<NotFound />}></Route>
            </Route>
          </Routes>
        </main>
        <Footer/>
      </Router>
    </UserProvider>
    </CartProvider>
  );
}

export default App;
