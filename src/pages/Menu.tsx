
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/ProductCard';
import ProductDialog from '@/components/ProductDialog';
import { getProducts, getCategories, Product } from '@/services/productService';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Menu = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        
        setProducts(productsData);
        setCategories(categoriesData);
        setActiveCategory(categoriesData[0] || null);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };
  
  const closeDialog = () => {
    setIsDialogOpen(false);
  };
  
  // Filter products based on search term and active category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !activeCategory || product.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="py-8 came-container">
      {/* Search and Category Filter */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
        <div className="relative w-full md:w-auto md:flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex overflow-x-auto space-x-2 w-full md:w-auto scrollbar-hide">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1.5 text-sm whitespace-nowrap rounded-md ${
                activeCategory === category 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : (
        <div>
          {categories.map(category => (
            <div key={category} className={activeCategory === category ? 'block' : 'hidden'}>
              <h2 className="text-3xl font-bold mono mb-6">{category}</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts
                  .filter(product => product.category === category)
                  .map(product => (
                    <ProductCard 
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      description={product.description}
                      image={product.image}
                      price={product.base_price}
                      category={product.category}
                      onClick={() => handleProductClick(product)}
                    />
                  ))
                }
              </div>
            </div>
          ))}
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Product Details Dialog */}
      <ProductDialog 
        product={selectedProduct} 
        open={isDialogOpen} 
        onClose={closeDialog} 
      />
    </div>
  );
};

export default Menu;
