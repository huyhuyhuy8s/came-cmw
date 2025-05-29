
import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { productFactoryService } from '@/services/productFactoryService';

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<any[]>([]);

  // Sample data using Factory pattern
  useEffect(() => {
    const sampleProducts = [
      productFactoryService.createCoffeeProduct({
        id: 1,
        name: 'Signature Blend',
        price: 4.50
      }),
      productFactoryService.createTeaProduct({
        id: 2,
        name: 'Green Tea',
        price: 3.50
      }),
      productFactoryService.createCoffeeProduct({
        id: 3,
        name: 'Espresso',
        price: 3.00
      })
    ];

    // Use Decorator pattern to add extras
    const decoratedProducts = sampleProducts.map(product => 
      productFactoryService.createProductWithExtras(product, [
        () => 'Premium Quality',
        () => 'Freshly Brewed'
      ])
    );

    setProducts(decoratedProducts);
  }, []);

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'coffee', name: 'Coffee' },
    { id: 'tea', name: 'Tea' },
    { id: 'food', name: 'Food' },
    { id: 'dessert', name: 'Dessert' }
  ];

  return (
    <div className="py-8 came-container">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mono mb-4">Our Menu</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our carefully crafted selection of premium coffee, fresh teas, and delicious treats.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedCategory === category.id
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Menu;
