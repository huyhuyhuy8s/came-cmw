
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Cart = () => {
  const { items, updateQuantity, removeItem, clearCart, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [orderType, setOrderType] = useState('store'); // 'store', 'delivery', 'takeaway'
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  
  // Available time slots
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM', '06:00 PM'
  ];
  
  const handlePlaceOrder = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to place an order",
        variant: "destructive",
      });
      return;
    }
    
    if (items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add some items before placing an order.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate order type specific fields
    if (orderType === 'delivery' && !deliveryAddress) {
      toast({
        title: "Missing Information",
        description: "Please enter a delivery address",
        variant: "destructive",
      });
      return;
    }
    
    if (orderType === 'delivery' && !deliveryTime) {
      toast({
        title: "Missing Information",
        description: "Please select a delivery time",
        variant: "destructive",
      });
      return;
    }
    
    if (orderType === 'takeaway' && !pickupTime) {
      toast({
        title: "Missing Information",
        description: "Please select a pickup time",
        variant: "destructive",
      });
      return;
    }
    
    // Mock order placement
    toast({
      title: "Order Placed!",
      description: `Your ${orderType} order has been placed successfully.`,
    });
    
    // In a real app, this would send the order to the backend
    console.log("Order placed:", {
      items,
      orderType,
      deliveryAddress,
      deliveryTime,
      pickupTime,
      total: getCartTotal(),
    });
    
    // Clear cart after successful order
    clearCart();
  };
  
  if (items.length === 0) {
    return (
      <div className="py-16 came-container">
        <h1 className="text-3xl font-bold mono mb-8">Your Cart</h1>
        <div className="text-center py-16">
          <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some delicious items to your cart.</p>
          <Link to="/menu">
            <Button className="bg-black hover:bg-gray-800">
              Browse Menu
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-12 came-container">
      <h1 className="text-3xl font-bold mono mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2">
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 border-b pb-6">
                <div className="w-20 h-20 bg-gray-100 overflow-hidden rounded-md flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="font-mono">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  
                  {item.options && item.options.length > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      Options: {item.options.join(', ')}
                    </p>
                  )}
                  
                  {item.size && (
                    <p className="text-sm text-gray-600 mt-1">
                      Size: {item.size}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7" 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7" 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-500 hover:text-red-500"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-medium mb-6">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-mono">${getCartTotal().toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-mono">${(getCartTotal() * 0.1).toFixed(2)}</span>
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span className="font-mono">${(getCartTotal() * 1.1).toFixed(2)}</span>
              </div>
            </div>
            
            {/* Order Type Selection */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Order Type</h3>
              <RadioGroup
                value={orderType}
                onValueChange={setOrderType}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="store" id="store" />
                  <Label htmlFor="store">Order at Store</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery">Delivery</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="takeaway" id="takeaway" />
                  <Label htmlFor="takeaway">Takeaway</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Conditional fields based on order type */}
            {orderType === 'delivery' && (
              <div className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter your address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="delivery-time">Delivery Time</Label>
                  <Select
                    value={deliveryTime}
                    onValueChange={setDeliveryTime}
                  >
                    <SelectTrigger id="delivery-time">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            {orderType === 'takeaway' && (
              <div className="space-y-2 mb-6">
                <Label htmlFor="pickup-time">Pickup Time</Label>
                <Select
                  value={pickupTime}
                  onValueChange={setPickupTime}
                >
                  <SelectTrigger id="pickup-time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <Button 
              className="w-full bg-black hover:bg-gray-800" 
              onClick={handlePlaceOrder}
            >
              {isAuthenticated ? 'Place Order' : 'Sign In to Order'}
            </Button>
            
            {!isAuthenticated && (
              <p className="text-sm text-gray-500 mt-4 text-center">
                You need to sign in before placing an order.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
