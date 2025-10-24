import { Product } from '../services/api';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Smartphone Galaxy S24',
    description: 'Smartphone Android com tela de 6.2 polegadas, 128GB de armazenamento e câmera de 50MP.',
    price: 1299.99,
    image: 'https://via.placeholder.com/300x300/007bff/ffffff?text=Galaxy+S24',
    category: 'Smartphones',
    stock: 15
  },
  {
    id: '2',
    name: 'Notebook Dell Inspiron',
    description: 'Notebook com processador Intel i5, 8GB RAM, 256GB SSD e tela de 15.6 polegadas.',
    price: 2499.99,
    image: 'https://via.placeholder.com/300x300/28a745/ffffff?text=Dell+Inspiron',
    category: 'Notebooks',
    stock: 8
  },
  {
    id: '3',
    name: 'Fone de Ouvido Bluetooth2',
    description: 'Fone sem fio com cancelamento de ruído, bateria de 30h e carregamento rápido.',
    price: 199.99,
    image: 'https://via.placeholder.com/300x300/ffc107/ffffff?text=Headphone',
    category: 'Acessórios',
    stock: 25
  },
  {
    id: '4',
    name: 'Smart TV 55" 4K',
    description: 'Smart TV LED 55 polegadas com resolução 4K, HDR e sistema Android TV.',
    price: 1899.99,
    image: 'https://via.placeholder.com/300x300/dc3545/ffffff?text=Smart+TV+55',
    category: 'TVs',
    stock: 5
  },
  {
    id: '5',
    name: 'Tablet iPad Air',
    description: 'Tablet Apple com tela de 10.9 polegadas, chip M1 e 64GB de armazenamento.',
    price: 3299.99,
    image: 'https://via.placeholder.com/300x300/6f42c1/ffffff?text=iPad+Air',
    category: 'Tablets',
    stock: 12
  },
  {
    id: '6',
    name: 'Câmera Digital Canon2',
    description: 'Câmera DSLR com sensor de 24MP, lente 18-55mm e gravação em 4K.',
    price: 1599.99,
    image: 'https://via.placeholder.com/300x300/17a2b8/ffffff?text=Canon+DSLR',
    category: 'Câmeras',
    stock: 7
  }
];
