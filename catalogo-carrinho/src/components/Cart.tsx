import React from 'react';
import { useCart } from '../contexts/CartContext';
import './Cart.css';

interface CartProps {
  onContinueShopping?: () => void;
  onCheckout?: () => void;
}

const Cart: React.FC<CartProps> = ({ onContinueShopping, onCheckout }) => {
  const { state, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      alert('Funcionalidade de checkout será implementada em breve!');
      clearCart();
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-header">
          <h2>Carrinho de Compras</h2>
        </div>
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <p>Seu carrinho está vazio</p>
          <p className="empty-cart-subtitle">Adicione alguns produtos para começar!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Carrinho de Compras</h2>
        <span className="item-count">{state.itemCount} itens</span>
      </div>

      <div className="cart-items">
        {state.items.map((item) => (
          <div key={item.product.id} className="cart-item">
            <div className="item-details">
              <div className="item-main-info">
                <h3 className="item-name">{item.product.name}</h3>
                <p className="item-category">{item.product.category}</p>
              </div>
              
              <div className="item-price-info">
                <p className="item-price">R$ {item.product.price.toFixed(2)} un</p>
                <div className="item-total">
                  Total: R$ {(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>

              <div className="item-controls">
                <div className="quantity-controls">
                  <button 
                    onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.product.id)}
                  className="remove-btn"
                  title="Remover item"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Total de itens:</span>
          <span>{state.itemCount}</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>R$ {state.total.toFixed(2)}</span>
        </div>
        
        <div className="cart-actions">
          {onContinueShopping && (
            <button onClick={onContinueShopping} className="continue-shopping-btn">
              ← Continuar Comprando
            </button>
          )}
          <button onClick={clearCart} className="clear-cart-btn">
            Limpar Carrinho
          </button>
          <button onClick={handleCheckout} className="checkout-btn">
            Finalizar Compra
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
