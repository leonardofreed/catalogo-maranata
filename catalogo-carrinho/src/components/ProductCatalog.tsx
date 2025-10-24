import React, { useState, useEffect } from 'react';
import { Product } from '../services/api';
import apiService from '../services/api';
import { useCart } from '../contexts/CartContext';
import './ProductCatalog.css';

const ProductCatalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  // atualmente o filtro por categoria é controlado no componente de categorias
  // (ou será adicionado via contexto). Para evitar warnings, mantemos
  // selectedCategory como string vazia (sem setter não utilizado).
  const selectedCategory = '';
  const { addToCart } = useCart();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getProducts();
      setProducts(data);
    } catch (err) {
      setError('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // categorias são gerenciadas pelo slider de categorias (componente separado)
  // se precisar usar aqui, podemos obter via props ou contexto no futuro.

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };




  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando produtos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={loadProducts} className="retry-button">
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        <div className="header-top">
          <h1>Catálogo de Produtos</h1>
        </div>
        
        <div className="filters">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          {/* seletor de categoria removido */}
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <p>Nenhum produto encontrado</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img 
                  src={product.image || '/placeholder-image.jpg'} 
                  alt={product.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                  }}
                />
              </div>
              
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-category">{product.category}</p>
                
                <div className="product-price">
                  <span className="price">R$ {product.price.toFixed(2)}</span>
                  <span className="stock">
                    {product.stock > 0 ? `${product.stock} em estoque` : 'Fora de estoque'}
                  </span>
                </div>
                
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className={`add-to-cart-btn ${product.stock === 0 ? 'disabled' : ''}`}
                >
                  {product.stock === 0 ? 'Fora de estoque' : 'Adicionar ao carrinho'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default ProductCatalog;
