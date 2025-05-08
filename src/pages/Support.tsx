
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';

const Support = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [issueType, setIssueType] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !issueType || !message) {
      toast({
        title: "Form Incomplete",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // This would actually submit to a backend API in a real app
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSuccess(true);
      toast({
        title: "Support Ticket Created",
        description: "We've received your message and will get back to you soon.",
      });
      
      // Reset form
      setName(user?.username || '');
      setEmail(user?.email || '');
      setIssueType('');
      setMessage('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const issueTypes = [
    "Order Problem",
    "Website Error",
    "Account Access",
    "Payment Issue",
    "Product Inquiry",
    "General Feedback",
    "Other",
  ];
  
  return (
    <div className="py-12 came-container">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mono mb-8">Contact Support</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-xl font-medium mb-4">Need Help?</h2>
            <p className="text-gray-600 mb-6">
              Our support team is here to help with any issues you might be experiencing.
              Fill out the form with details about your problem, and we'll get back to you as soon as possible.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-gray-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-gray-600">support@came.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-gray-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-gray-600">(555) 123-4567</p>
                  <p className="text-sm text-gray-500">Mon-Fri, 9am-5pm</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            {isSuccess ? (
              <div className="bg-green-50 text-green-800 p-6 rounded-md">
                <h3 className="text-lg font-medium mb-2">Thank You!</h3>
                <p>Your support ticket has been submitted successfully.</p>
                <p className="mt-2">
                  Our team will review your request and get back to you within 24-48 hours.
                </p>
                <Button 
                  className="mt-4 bg-green-600 hover:bg-green-700"
                  onClick={() => setIsSuccess(false)}
                >
                  Submit Another Request
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-6 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="issue-type">Issue Type</Label>
                  <Select value={issueType} onValueChange={setIssueType} disabled={isSubmitting}>
                    <SelectTrigger id="issue-type">
                      <SelectValue placeholder="Select an issue" />
                    </SelectTrigger>
                    <SelectContent>
                      {issueTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please describe your issue in detail"
                    className="min-h-[120px]"
                    disabled={isSubmitting}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="bg-black hover:bg-gray-800"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
