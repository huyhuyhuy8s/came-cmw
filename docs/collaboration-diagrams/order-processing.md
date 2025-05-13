
# Order Processing Collaboration Diagram

```mermaid
flowchart TD
    User((User))
    CartPage[Cart Page]
    PaymentPage[Payment Page]
    TrackingPage[Order Tracking]
    CartContext[Cart Context]
    OrderService[Order Service]
    NotifService[Notification Service]
    Database[(Supabase Database)]
    
    User -->|1. Review cart| CartPage
    User -->|2. Set delivery options| CartPage
    User -->|3. Proceed to payment| CartPage
    
    CartPage -->|4. Calculate totals| CartPage
    CartPage -->|5. Create order| OrderService
    OrderService -->|6. Insert order| Database
    Database -->|7. Return order| OrderService
    OrderService -->|8. Return order| CartPage
    
    CartPage -->|9. Add order items| OrderService
    OrderService -->|10. Insert items| Database
    
    CartPage -->|11. Create notification| NotifService
    NotifService -->|12. Insert notification| Database
    
    CartPage -->|13. Clear cart| CartContext
    CartContext -->|14. Delete items| Database
    
    CartPage -->|15. Navigate| PaymentPage
    
    User -->|16. Enter payment info| PaymentPage
    User -->|17. Complete payment| PaymentPage
    
    PaymentPage -->|18. Update order status| OrderService
    OrderService -->|19. Update status| Database
    
    PaymentPage -->|20. Create notification| NotifService
    NotifService -->|21. Insert notification| Database
    
    PaymentPage -->|22. Navigate| TrackingPage
    
    User -->|23. View order status| TrackingPage
    TrackingPage -->|24. Get order| OrderService
    OrderService -->|25. Query order| Database
    Database -->|26. Return order| OrderService
    OrderService -->|27. Return order| TrackingPage
    
    TrackingPage -->|28. Get items| OrderService
    OrderService -->|29. Query items| Database
    Database -->|30. Return items| OrderService
    OrderService -->|31. Return items| TrackingPage
    
    TrackingPage -->|32. Display status| User
```

## Notes
- This diagram shows the complete order process from cart to tracking
- Numbered steps indicate the sequence of operations
- The process spans multiple pages: cart, payment, and tracking
- Database operations occur at each major step
- Notifications are created at key points in the process
