import React from 'react';
import { useCart } from '../contexts/CartContext';
import './Header.css';

interface HeaderProps {
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const { state } = useCart();

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>🛍️ Catálogo Online</h1>
        </div>
        
        <nav className="nav">
          <button className="nav-link active">Catálogo</button>
        </nav>
        
        <div className="cart-button-container">
          <button 
            onClick={onCartClick}
            className="cart-button"
            title="Ver carrinho"
          >
            🛒 Carrinho
            {state.itemCount > 0 && (
              <span className="cart-badge">{state.itemCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
