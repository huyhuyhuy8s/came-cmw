
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { NotFound } from './NotFound';

// Campaign data - this would come from an API in a real application
const CAMPAIGNS = {
  summer: {
    id: 'summer',
    title: 'Summer Specials',
    subtitle: 'Beat the heat with our refreshing summer beverages',
    description: 'Enjoy our limited-time summer menu featuring refreshing iced drinks and fruity flavors. Available until September 30.',
    image: '/lovable-uploads/b571cd5f-7223-4d8c-8d16-bfb5bdeef89d.png',
    features: [
      {
        title: 'Iced Lavender Latte',
        description: 'Our signature espresso with lavender syrup and cold milk over ice.'
      },
      {
        title: 'Strawberry Cold Brew',
        description: 'Smooth cold brew infused with natural strawberry flavor.'
      },
      {
        title: 'Peach Iced Tea',
        description: 'Freshly brewed black tea with real peach puree and a hint of honey.'
      }
    ],
    discount: '15% off all iced drinks between 2-4pm daily'
  },
  loyalty: {
    id: 'loyalty',
    title: 'Loyalty Rewards',
    subtitle: 'Join our rewards program and earn free drinks',
    description: 'Sign up for our loyalty program today and start earning points with every purchase. Redeem your points for free drinks, food items, and exclusive merchandise.',
    image: '/lovable-uploads/624d2ca0-4248-41b4-80b9-aa0cfee9eb6d.png',
    features: [
      {
        title: 'Earn Points',
        description: '1 point for every dollar spent. Reach different tiers for better rewards.'
      },
      {
        title: 'Birthday Treat',
        description: 'Get a free drink of your choice on your birthday.'
      },
      {
        title: 'Early Access',
        description: 'Members get early access to seasonal items and special promotions.'
      }
    ],
    discount: 'Sign up today and get a free drink with your first purchase'
  }
};

const Campaign = () => {
  const { id } = useParams<{ id: string }>();
  const campaign = id ? CAMPAIGNS[id as keyof typeof CAMPAIGNS] : null;
  
  if (!campaign) {
    return <NotFound />;
  }
  
  return (
    <div className="py-12 came-container">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mono mb-2">{campaign.title}</h1>
        <p className="text-xl text-gray-600 mb-8">{campaign.subtitle}</p>
        
        <div className="relative h-80 mb-8 rounded-lg overflow-hidden">
          <img 
            src={campaign.image}
            alt={campaign.title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="prose max-w-none mb-12">
          <p className="text-lg mb-6">{campaign.description}</p>
          
          <h2 className="text-2xl font-semibold mb-4">Featured Items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {campaign.features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-black text-white p-6 rounded-lg mb-8">
            <h2 className="text-xl font-medium mb-2">Special Offer</h2>
            <p className="text-lg">{campaign.discount}</p>
          </div>
          
          <div className="flex gap-4">
            <Link to="/menu">
              <Button className="bg-black hover:bg-gray-800">
                Order Now
              </Button>
            </Link>
            
            <Link to="/">
              <Button variant="outline">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Campaign;
