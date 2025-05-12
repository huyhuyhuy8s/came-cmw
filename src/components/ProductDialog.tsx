
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from "@/components/ui/separator";

interface ProductDialogProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

// Define option categories
const OPTION_CATEGORIES = {
  FLAVORS: 'flavors',
  SUGAR: 'sugar',
  ICE: 'ice'
};

// Map options to categories
const flavorOptions = [
  "Siro caramel", "Thêm shot espresso", "Siro chocolate", 
  "Sữa hạnh nhân", "Sữa đậu nành", "Siro vanilla", "Kem tươi"
];
const sugarOptions = ["Ít đường", "Không đường"];
const iceOptions = ["Không đá", "Ít đá"];

// Function to format price in VND
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
    .format(price)
    .replace('₫', 'VND');
};

// Function to determine which category an option belongs to
const getOptionCategory = (optionValue: string): string => {
  if (flavorOptions.includes(optionValue)) return OPTION_CATEGORIES.FLAVORS;
  if (sugarOptions.includes(optionValue)) return OPTION_CATEGORIES.SUGAR;
  if (iceOptions.includes(optionValue)) return OPTION_CATEGORIES.ICE;
  return OPTION_CATEGORIES.FLAVORS; // Default category
};

const ProductDialog: React.FC<ProductDialogProps> = ({ product, open, onClose }) => {
  const { toast } = useToast();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, ProductOption | null>>({
    [OPTION_CATEGORIES.FLAVORS]: null,
    [OPTION_CATEGORIES.SUGAR]: null,
    [OPTION_CATEGORIES.ICE]: null
  });
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

  // Organize options by category
  const categorizedOptions = options.reduce<Record<string, ProductOption[]>>(
    (acc, option) => {
      const category = getOptionCategory(option.value);
      if (!acc[category]) acc[category] = [];
      acc[category].push(option);
      return acc;
    },
    {
      [OPTION_CATEGORIES.FLAVORS]: [],
      [OPTION_CATEGORIES.SUGAR]: [],
      [OPTION_CATEGORIES.ICE]: []
    }
  );
  
  // Reset state when dialog opens/closes or product changes
  useEffect(() => {
    if (open && product) {
      setQuantity(1);
      
      // Set default selections for each category
      const defaultSelections = {
        [OPTION_CATEGORIES.FLAVORS]: null,
        [OPTION_CATEGORIES.SUGAR]: null,
        [OPTION_CATEGORIES.ICE]: null
      };

      // Set default ice option to "ít đá" if available
      const defaultIceOption = options.find(o => o.value === "ít đá");
      if (defaultIceOption) {
        defaultSelections[OPTION_CATEGORIES.ICE] = defaultIceOption;
      }

      setSelectedOptions(defaultSelections);
      
      // Set default size to "Nhỏ" if available
      const defaultSize = sizes.find(s => s.value === "Nhỏ");
      if (defaultSize) {
        setSelectedSize(defaultSize.id);
        setSelectedSizeObj(defaultSize);
      } else if (sizes.length > 0) {
        setSelectedSize(sizes[0].id);
        setSelectedSizeObj(sizes[0]);
      } else {
        setSelectedSize(null);
        setSelectedSizeObj(null);
      }
    }
  }, [open, product, options, sizes]);
  
  // Update selected size object when selection changes
  useEffect(() => {
    if (selectedSize) {
      const size = sizes.find(s => s.id === selectedSize);
      setSelectedSizeObj(size || null);
    } else {
      setSelectedSizeObj(null);
    }
  }, [selectedSize, sizes]);
  
  if (!product) return null;
  
  // Calculate prices correctly
  const getOptionAdjustment = () => {
    let total = 0;
    Object.values(selectedOptions).forEach(option => {
      if (option) total += option.price_adjustment || 0;
    });
    return total;
  };

  const optionAdjustment = getOptionAdjustment();
  const basePrice = Number(product.price_min || 0);
  const sizePrice = selectedSizeObj?.price || 0;
  const totalUnitPrice = basePrice + optionAdjustment;
  const totalPrice = totalUnitPrice * quantity;
  
  const handleAddToCart = () => {
    // Validate that size is selected if available
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
      // Collect selected options
      const selectedOptionsValues = Object.values(selectedOptions)
        .filter(Boolean)
        .map(option => option!.value);
      
      const finalPrice = basePrice + optionAdjustment + (selectedSizeObj?.price || 0);
      
      addItem({
        product_id: product.id,
        name: product.name,
        price: finalPrice,
        image: product.image_url || '/placeholder.svg',
        quantity: quantity,
        options: selectedOptionsValues,
        size: selectedSizeObj?.value,
        selected_option_id: Object.values(selectedOptions).find(Boolean)?.id,
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
  
  const handleOptionChange = (category: string, optionId: string) => {
    const option = options.find(o => o.id === optionId) || null;
    setSelectedOptions(prev => ({
      ...prev,
      [category]: option
    }));
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  // Calculate display price that includes base price + size price + option adjustment
  const displayPrice = basePrice + (selectedSizeObj?.price || 0) + optionAdjustment;
  const displayTotalPrice = displayPrice * quantity;
  
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
              {formatPrice(displayTotalPrice)}
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
            <div className="space-y-6">
              {/* Size selection */}
              {sizes.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select a size</label>
                  <Select value={selectedSize || ''} onValueChange={setSelectedSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select one" />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map(size => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.label} ({formatPrice(size.price)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <Separator />
              
              {/* Flavor options */}
              {categorizedOptions[OPTION_CATEGORIES.FLAVORS].length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select flavor (optional)</label>
                  <RadioGroup 
                    value={selectedOptions[OPTION_CATEGORIES.FLAVORS]?.id || ''} 
                    onValueChange={(value) => handleOptionChange(OPTION_CATEGORIES.FLAVORS, value)}
                    className="grid grid-cols-2 gap-2"
                  >
                    <div className="col-span-2">
                      <Label 
                        htmlFor={`no-${OPTION_CATEGORIES.FLAVORS}`}
                        className="flex items-center space-x-2 border p-2 rounded-md cursor-pointer hover:bg-gray-50"
                      >
                        <RadioGroupItem 
                          value=""
                          id={`no-${OPTION_CATEGORIES.FLAVORS}`}
                        />
                        <span>No flavor</span>
                      </Label>
                    </div>
                    {categorizedOptions[OPTION_CATEGORIES.FLAVORS].map(option => (
                      <Label 
                        key={option.id}
                        htmlFor={option.id}
                        className="flex items-center space-x-2 border p-2 rounded-md cursor-pointer hover:bg-gray-50"
                      >
                        <RadioGroupItem 
                          value={option.id} 
                          id={option.id} 
                        />
                        <span>{option.label}</span>
                        {option.price_adjustment > 0 && (
                          <span className="text-xs text-gray-500">
                            +{formatPrice(option.price_adjustment)}
                          </span>
                        )}
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
              )}
              
              {/* Sugar options */}
              {categorizedOptions[OPTION_CATEGORIES.SUGAR].length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sugar level (optional)</label>
                  <RadioGroup 
                    value={selectedOptions[OPTION_CATEGORIES.SUGAR]?.id || ''} 
                    onValueChange={(value) => handleOptionChange(OPTION_CATEGORIES.SUGAR, value)}
                  >
                    <div className="space-y-2">
                      <Label 
                        htmlFor={`no-${OPTION_CATEGORIES.SUGAR}`}
                        className="flex items-center space-x-2 border p-2 rounded-md cursor-pointer hover:bg-gray-50"
                      >
                        <RadioGroupItem 
                          value=""
                          id={`no-${OPTION_CATEGORIES.SUGAR}`}
                        />
                        <span>Regular sugar</span>
                      </Label>
                      
                      {categorizedOptions[OPTION_CATEGORIES.SUGAR].map(option => (
                        <Label 
                          key={option.id}
                          htmlFor={option.id}
                          className="flex items-center space-x-2 border p-2 rounded-md cursor-pointer hover:bg-gray-50"
                        >
                          <RadioGroupItem 
                            value={option.id} 
                            id={option.id} 
                          />
                          <span>{option.label}</span>
                          {option.price_adjustment > 0 && (
                            <span className="text-xs text-gray-500">
                              +{formatPrice(option.price_adjustment)}
                            </span>
                          )}
                        </Label>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              )}
              
              {/* Ice options */}
              {categorizedOptions[OPTION_CATEGORIES.ICE].length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ice level (optional)</label>
                  <RadioGroup 
                    value={selectedOptions[OPTION_CATEGORIES.ICE]?.id || ''} 
                    onValueChange={(value) => handleOptionChange(OPTION_CATEGORIES.ICE, value)}
                  >
                    <div className="space-y-2">
                      <Label 
                        htmlFor={`no-${OPTION_CATEGORIES.ICE}`}
                        className="flex items-center space-x-2 border p-2 rounded-md cursor-pointer hover:bg-gray-50"
                      >
                        <RadioGroupItem 
                          value=""
                          id={`no-${OPTION_CATEGORIES.ICE}`}
                        />
                        <span>Regular ice</span>
                      </Label>
                      
                      {categorizedOptions[OPTION_CATEGORIES.ICE].map(option => (
                        <Label 
                          key={option.id}
                          htmlFor={option.id}
                          className="flex items-center space-x-2 border p-2 rounded-md cursor-pointer hover:bg-gray-50"
                        >
                          <RadioGroupItem 
                            value={option.id} 
                            id={option.id} 
                          />
                          <span>{option.label}</span>
                          {option.price_adjustment > 0 && (
                            <span className="text-xs text-gray-500">
                              +{formatPrice(option.price_adjustment)}
                            </span>
                          )}
                        </Label>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleAddToCart} 
            className="w-full bg-black hover:bg-gray-800 text-white"
            disabled={isAddingToCart || (sizes.length > 0 && !selectedSize)}
          >
            {isAddingToCart ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                <span>Adding...</span>
              </div>
            ) : (
              `Add to cart ${formatPrice(displayTotalPrice)}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
