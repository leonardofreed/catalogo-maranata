import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import './Checkout.css';

interface CheckoutProps {
  onBack: () => void;
  onComplete: () => void;
}

interface DeliveryAddress {
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
}

const Checkout: React.FC<CheckoutProps> = ({ onBack, onComplete }) => {
  const { state, clearCart } = useCart();
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [address, setAddress] = useState<DeliveryAddress>({
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: ''
  });
  const [customerInfo, setCustomerInfo] = useState({
    nome: ''
  });

  const deliveryFee = deliveryType === 'delivery' ? 4.50 : 0;
  const totalWithDelivery = state.total + deliveryFee;

  const handleAddressChange = (field: keyof DeliveryAddress, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleCustomerChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (deliveryType === 'delivery') {
      const requiredFields = ['cep', 'rua', 'numero', 'bairro'];
      const missingFields = requiredFields.filter(field => !address[field as keyof DeliveryAddress]);
      
      if (missingFields.length > 0) {
        alert('Por favor, preencha todos os campos obrigatórios do endereço.');
        return;
      }
    }

    if (!customerInfo.nome) {
      alert('Por favor, preencha o nome do cliente.');
      return;
    }

    // Preparar mensagem para WhatsApp
    const whatsappMessage = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/5565992242567?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Limpar carrinho e voltar ao catálogo
    clearCart();
    onComplete();
  };

  const generateWhatsAppMessage = () => {
    let message = `🛒 *NOVO PEDIDO* 🛒\n\n`;
    message += `👤 *Cliente:* ${customerInfo.nome}\n\n`;
    
    message += `📦 *Itens do Pedido:*\n`;
    state.items.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name} - Qtd: ${item.quantity} - R$ ${(item.product.price * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\n💰 *Resumo Financeiro:*\n`;
    message += `Subtotal: R$ ${state.total.toFixed(2)}\n`;
    message += `Taxa de ${deliveryType === 'delivery' ? 'Entrega' : 'Retirada'}: R$ ${deliveryFee.toFixed(2)}\n`;
    message += `*TOTAL: R$ ${totalWithDelivery.toFixed(2)}*\n\n`;
    
    message += `🚚 *Tipo de Entrega:* ${deliveryType === 'delivery' ? 'Entrega em Casa' : 'Retirar na Loja'}\n`;
    
    if (deliveryType === 'delivery') {
      message += `\n📍 *Endereço de Entrega:*\n`;
      message += `CEP: ${address.cep}\n`;
      message += `Rua: ${address.rua}\n`;
      message += `Número: ${address.numero}\n`;
      if (address.complemento) message += `Complemento: ${address.complemento}\n`;
      message += `Bairro: ${address.bairro}\n`;
    } else {
      message += `\n🏪 *Retirada na Loja*\n`;
      message += `Endereço: Rua das Flores, 123 - Centro\n`;
      message += `Horário: Seg-Sex 8h-18h, Sáb 8h-12h\n`;
    }
    
    message += `\n⏰ *Pedido realizado em:* ${new Date().toLocaleString('pt-BR')}`;
    
    return message;
  };

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <button onClick={onBack} className="back-btn">
          ← Voltar ao Carrinho
        </button>
        <h2>Finalizar Compra</h2>
      </div>

      <div className="checkout-content">
        <div className="checkout-form">
          <form onSubmit={handleSubmit}>
            {/* Dados do Cliente */}
            <div className="form-section">
              <h3>📋 Dados do Cliente</h3>
              <div className="form-group">
                <label htmlFor="nome">Nome Completo *</label>
                <input
                  type="text"
                  id="nome"
                  value={customerInfo.nome}
                  onChange={(e) => handleCustomerChange('nome', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Tipo de Entrega */}
            <div className="form-section">
              <h3>🚚 Tipo de Entrega</h3>
              <div className="delivery-options">
                <label className="delivery-option">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="pickup"
                    checked={deliveryType === 'pickup'}
                    onChange={(e) => setDeliveryType(e.target.value as 'pickup' | 'delivery')}
                  />
                  <div className="option-content">
                    <span className="option-title">🏪 Retirar na Loja</span>
                    <span className="option-price">R$ 0,00</span>
                    <span className="option-description">Retire seu pedido em nossa loja física</span>
                  </div>
                </label>

                <label className="delivery-option">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="delivery"
                    checked={deliveryType === 'delivery'}
                    onChange={(e) => setDeliveryType(e.target.value as 'pickup' | 'delivery')}
                  />
                  <div className="option-content">
                    <span className="option-title">🚚 Entrega em Casa</span>
                    <span className="option-price">R$ 4,50</span>
                    <span className="option-description">Entregamos no seu endereço</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Endereço de Entrega */}
            {deliveryType === 'delivery' && (
              <div className="form-section">
                <h3>📍 Endereço de Entrega</h3>
                <div className="form-group">
                  <label htmlFor="cep">CEP *</label>
                  <input
                    type="text"
                    id="cep"
                    value={address.cep}
                    onChange={(e) => handleAddressChange('cep', e.target.value)}
                    placeholder="00000-000"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="rua">Rua/Avenida *</label>
                  <input
                    type="text"
                    id="rua"
                    value={address.rua}
                    onChange={(e) => handleAddressChange('rua', e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="numero">Número *</label>
                    <input
                      type="text"
                      id="numero"
                      value={address.numero}
                      onChange={(e) => handleAddressChange('numero', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="complemento">Complemento</label>
                    <input
                      type="text"
                      id="complemento"
                      value={address.complemento}
                      onChange={(e) => handleAddressChange('complemento', e.target.value)}
                      placeholder="Apto, casa, etc."
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="bairro">Bairro *</label>
                  <input
                    type="text"
                    id="bairro"
                    value={address.bairro}
                    onChange={(e) => handleAddressChange('bairro', e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="checkout-actions">
              <button type="button" onClick={onBack} className="cancel-btn">
                Cancelar
              </button>
              <button type="submit" className="confirm-btn">
                Confirmar Pedido
              </button>
            </div>
          </form>
        </div>

        {/* Resumo do Pedido */}
        <div className="order-summary">
          <h3>📦 Resumo do Pedido</h3>
          
          <div className="order-items">
            {state.items.map((item) => (
              <div key={item.product.id} className="order-item">
                <div className="item-info">
                  <span className="item-name">{item.product.name}</span>
                  <span className="item-quantity">Qtd: {item.quantity}</span>
                </div>
                <span className="item-price">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>R$ {state.total.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Taxa de {deliveryType === 'delivery' ? 'Entrega' : 'Retirada'}:</span>
              <span>R$ {deliveryFee.toFixed(2)}</span>
            </div>
            <div className="total-row final-total">
              <span>Total:</span>
              <span>R$ {totalWithDelivery.toFixed(2)}</span>
            </div>
          </div>

          {deliveryType === 'delivery' && (
            <div className="delivery-info">
              <h4>🚚 Informações de Entrega</h4>
              <p>Prazo de entrega: 2-3 dias úteis</p>
              <p>Horário de entrega: 8h às 18h</p>
            </div>
          )}

          {deliveryType === 'pickup' && (
            <div className="pickup-info">
              <h4>🏪 Informações de Retirada</h4>
              <p>Endereço da loja: Rua das Flores, 123 - Centro</p>
              <p>Horário de funcionamento: Seg-Sex 8h-18h, Sáb 8h-12h</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
