
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="bg-white p-8 flex flex-col justify-center min-h-[70vh] came-container ml-auto">
            <div className="max-w-lg">
              <h1 className="text-4xl md:text-5xl font-bold mono mb-6">
                Skip the line when you order online.
              </h1>
              <Link to="/menu">
                <Button className="bg-gray-800 hover:bg-black text-white px-8 py-6 rounded-full">
                  Order now
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="bg-gray-100 min-h-[70vh]">
            <img 
              src="/lovable-uploads/624d2ca0-4248-41b4-80b9-aa0cfee9eb6d.png"
              alt="Came Coffee and pastries" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
      
      {/* Campaign Section */}
      <section className="py-16 bg-gray-50">
        <div className="came-container">
          <h2 className="text-2xl md:text-3xl font-bold mono mb-8">Current Campaigns</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Summer Specials</h3>
              <p className="text-gray-600 mb-4">
                Beat the heat with our refreshing summer drinks at special prices.
                Try our new Iced Lavender Latte!
              </p>
              <Link to="/campaign/summer">
                <Button variant="outline" className="mt-2">
                  View Details
                </Button>
              </Link>
            </div>
            
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Loyalty Rewards</h3>
              <p className="text-gray-600 mb-4">
                Earn points with every purchase and receive free drinks and treats.
                Sign up today to start earning!
              </p>
              <Link to="/campaign/loyalty">
                <Button variant="outline" className="mt-2">
                  Join Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-16">
        <div className="came-container">
          <h2 className="text-2xl md:text-3xl font-bold mono mb-8">Customer Favorites</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
              <img 
                src="/lovable-uploads/a944091e-cc01-482f-877c-c3b474d20013.png"
                alt="Latte" 
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-medium">Classic Latte</h3>
                <p className="text-sm text-gray-600 mt-1">Smooth espresso with velvety steamed milk</p>
                <Link to="/menu">
                  <Button variant="link" className="mt-2 px-0">
                    Order Now
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
              <img 
                src="/lovable-uploads/624d2ca0-4248-41b4-80b9-aa0cfee9eb6d.png"
                alt="Drip Coffee" 
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-medium">House Drip Coffee</h3>
                <p className="text-sm text-gray-600 mt-1">Fresh brewed with our signature house blend</p>
                <Link to="/menu">
                  <Button variant="link" className="mt-2 px-0">
                    Order Now
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
              <img 
                src="/lovable-uploads/b571cd5f-7223-4d8c-8d16-bfb5bdeef89d.png"
                alt="Iced Coffee" 
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-medium">Iced Coffee</h3>
                <p className="text-sm text-gray-600 mt-1">Refreshingly cool for warm days</p>
                <Link to="/menu">
                  <Button variant="link" className="mt-2 px-0">
                    Order Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
