
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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

export interface ProductOption {
  id: number;
  name: string;
  price_adjustment: number;
}

export interface ProductSize {
  id: number;
  name: string;
  price_adjustment: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  base_price: number;
  image: string;
  options?: ProductOption[];
  sizes?: ProductSize[];
}

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
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  
  if (!product) return null;
  
  const selectedOptionObj = product.options?.find(o => o.name === selectedOption);
  const selectedSizeObj = product.sizes?.find(s => s.name === selectedSize);
  
  const optionAdjustment = selectedOptionObj?.price_adjustment || 0;
  const sizeAdjustment = selectedSizeObj?.price_adjustment || 0;
  
  const totalPrice = (product.base_price + optionAdjustment + sizeAdjustment) * quantity;
  
  const handleAddToCart = () => {
    const selectedOptions = selectedOption ? [selectedOption] : [];
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.base_price + optionAdjustment + sizeAdjustment,
      image: product.image,
      quantity: quantity,
      options: selectedOptions,
      size: selectedSize || undefined,
    });
    
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added to your cart`,
    });
    
    onClose();
    setQuantity(1);
    setSelectedOption(null);
    setSelectedSize(null);
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
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="aspect-square overflow-hidden rounded-md">
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>
          
          <p className="text-sm text-gray-600">{product.description}</p>
          
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
          
          {product.options && product.options.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Select an option</label>
              <Select value={selectedOption || ''} onValueChange={setSelectedOption}>
                <SelectTrigger>
                  <SelectValue placeholder="Select one" />
                </SelectTrigger>
                <SelectContent>
                  {product.options.map(option => (
                    <SelectItem key={option.id} value={option.name}>
                      {option.name} {option.price_adjustment > 0 && `(+$${option.price_adjustment.toFixed(2)})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Select a size</label>
              <Select value={selectedSize || ''} onValueChange={setSelectedSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Select one" />
                </SelectTrigger>
                <SelectContent>
                  {product.sizes.map(size => (
                    <SelectItem key={size.id} value={size.name}>
                      {size.name} {size.price_adjustment > 0 && `(+$${size.price_adjustment.toFixed(2)})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleAddToCart} 
            className="w-full bg-black hover:bg-gray-800 text-white"
          >
            Add to cart ${totalPrice.toFixed(2)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
