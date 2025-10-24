import React, { useState } from 'react';
import { CartProvider } from './contexts/CartContext';
import { ProductProvider } from './contexts/ProductContext';
import Header from './components/Header';
import ProductCatalog from './components/ProductCatalog';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import CategorySlider from './components/CategorySlider';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState<'catalog' | 'cart' | 'checkout'>('catalog');

  const handleCartClick = () => {
    setCurrentView(currentView === 'cart' ? 'catalog' : 'cart');
  };

  const handleCheckout = () => {
    setCurrentView('checkout');
  };

  const handleBackToCart = () => {
    setCurrentView('cart');
  };

  const handleBackToCatalog = () => {
    setCurrentView('catalog');
  };

  const handleOrderComplete = () => {
    setCurrentView('catalog');
  };

  return (
    <ProductProvider>
      <CartProvider>
        <div className="App">
          <Header onCartClick={handleCartClick} />
          <main className="main-content">
            {currentView === 'catalog' && (
              <>
                <CategorySlider />
                <ProductCatalog />
              </>
            )}
            {currentView === 'cart' && (
              <Cart 
                onContinueShopping={handleBackToCatalog}
                onCheckout={handleCheckout}
              />
            )}
            {currentView === 'checkout' && (
              <Checkout 
                onBack={handleBackToCart}
                onComplete={handleOrderComplete}
              />
            )}
          </main>
        </div>
      </CartProvider>
    </ProductProvider>
  );
}

export default App;
