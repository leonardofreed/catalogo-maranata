import React from 'react';
import './CategorySlider.css';

interface Category {
  id: number;
  name: string;
}

const categories: Category[] = [
  { id: 1, name: 'Lanches' },
  { id: 2, name: 'Bebidas' },
  { id: 3, name: 'Sobremesas' },
  { id: 4, name: 'Combos' },
  { id: 5, name: 'Porções' },
  { id: 6, name: 'Vegetariano' },
];

const CategorySlider: React.FC = () => {
  return (
    <div className="category-slider-container">
      <div className="category-slider">
        {categories.map((category) => (
          <div key={category.id} className="category-item">
            <span>{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySlider;