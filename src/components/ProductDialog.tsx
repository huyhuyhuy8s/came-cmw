
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Minus, Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCart } from '@/hooks/useCart';
import { Product, ProductOption, ProductSize, getProductOptions, getProductSizes } from '@/services/productService';
import { useQuery } from '@tanstack/react-query';

interface ProductDialogProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

const ProductDialog: React.FC<ProductDialogProps> = ({ product, open, onClose }) => {
  const { toast } = useToast();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedOptionObj, setSelectedOptionObj] = useState<ProductOption | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedSizeObj, setSelectedSizeObj] = useState<ProductSize | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Fetch product options and sizes using React Query
  const { 
    data: options = [], 
    isLoading: isLoadingOptions
  } = useQuery({
    queryKey: ['product-options'],
    queryFn: getProductOptions
  });
  
  const { 
    data: sizes = [], 
    isLoading: isLoadingSizes
  } = useQuery({
    queryKey: ['product-sizes'],
    queryFn: getProductSizes
  });
  
  // Reset state when dialog opens/closes or product changes
  useEffect(() => {
    if (open && product) {
      setQuantity(1);
      setSelectedOption(null);
      setSelectedOptionObj(null);
      setSelectedSize(null);
      setSelectedSizeObj(null);
    }
  }, [open, product]);
  
  // Update selected option and size objects when selections change
  useEffect(() => {
    if (selectedOption) {
      const option = options.find(o => o.id === selectedOption);
      setSelectedOptionObj(option || null);
    } else {
      setSelectedOptionObj(null);
    }
    
    if (selectedSize) {
      const size = sizes.find(s => s.id === selectedSize);
      setSelectedSizeObj(size || null);
    } else {
      setSelectedSizeObj(null);
    }
  }, [selectedOption, selectedSize, options, sizes]);
  
  if (!product) return null;
  
  const optionAdjustment = selectedOptionObj?.price_adjustment || 0;
  const basePrice = selectedSizeObj ? selectedSizeObj.price : product.price_min;
  const totalPrice = (basePrice + optionAdjustment) * quantity;
  
  const handleAddToCart = () => {
    // Validate that option and size are selected if available
    if (options.length > 0 && !selectedOption) {
      toast({
        title: "Option Required",
        description: "Please select an option before adding to cart",
        variant: "destructive",
      });
      return;
    }
    
    if (sizes.length > 0 && !selectedSize) {
      toast({
        title: "Size Required",
        description: "Please select a size before adding to cart",
        variant: "destructive",
      });
      return;
    }
    
    setIsAddingToCart(true);
    
    try {
      const selectedOptions = selectedOptionObj ? [selectedOptionObj.value] : [];
      
      addItem({
        product_id: product.id,
        name: product.name,
        price: basePrice + optionAdjustment,
        image: product.image_url || '/placeholder.svg',
        quantity: quantity,
        options: selectedOptions,
        size: selectedSizeObj?.value,
        selected_option_id: selectedOptionObj?.id,
        selected_size_id: selectedSizeObj?.id,
      });
      
      toast({
        title: "Added to cart",
        description: `${quantity} × ${product.name} added to your cart`,
      });
      
      onClose();
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Could not add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl mono">{product.name}</DialogTitle>
          <DialogDescription>{product.description}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {product.image_url && (
            <div className="aspect-square overflow-hidden rounded-md">
              <img
                src={product.image_url}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="font-mono">
              {totalPrice.toFixed(2)} US$
            </span>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={decrementQuantity} 
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={incrementQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {isLoadingOptions || isLoadingSizes ? (
            <div className="py-4 flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : (
            <>
              {options.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select an option (Required)</label>
                  <Select value={selectedOption || ''} onValueChange={setSelectedOption}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select one" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map(option => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label} {option.price_adjustment > 0 && `(+$${option.price_adjustment.toFixed(2)})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {sizes.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select a size (Required)</label>
                  <Select value={selectedSize || ''} onValueChange={setSelectedSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select one" />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map(size => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.label} (${size.price.toFixed(2)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleAddToCart} 
            className="w-full bg-black hover:bg-gray-800 text-white"
            disabled={isAddingToCart || (options.length > 0 && !selectedOption) || (sizes.length > 0 && !selectedSize)}
          >
            {isAddingToCart ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                <span>Adding...</span>
              </div>
            ) : (
              `Add to cart $${totalPrice.toFixed(2)}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
