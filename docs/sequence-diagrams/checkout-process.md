
# Checkout Process Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant CartPage as Cart Page
    participant CartContext as Cart Context
    participant OrderService as Order Service
    participant NotificationService as Notification Service
    participant Supabase as Database
    participant UI as UI Components

    %% Cart Page to Payment
    User->>CartPage: Review cart items
    User->>CartPage: Select order type (delivery/pickup/store)
    
    alt Delivery selected
        User->>CartPage: Enter delivery address
        User->>CartPage: Select delivery time
    else Takeaway selected
        User->>CartPage: Select pickup time
    end
    
    User->>CartPage: Click "Proceed to Payment"
    CartPage->>CartPage: Validate inputs
    CartPage->>CartPage: Calculate totals (subtotal, tax, fee)
    CartPage->>OrderService: createOrder(orderDetails)
    OrderService->>Supabase: Insert into orders table
    Supabase-->>OrderService: Return order with ID
    
    loop For each cart item
        CartPage->>OrderService: addOrderItem(item)
        OrderService->>Supabase: Insert into order_items table
    end
    
    CartPage->>NotificationService: createNotification("Order placed")
    NotificationService->>Supabase: Insert notification
    CartPage->>CartContext: clearCart()
    CartContext->>Supabase: Delete all cart items
    CartContext->>CartContext: Clear local cart state
    
    CartPage->>UI: Navigate to payment page
    
    %% Payment Page
    User->>UI: Enter payment details
    User->>UI: Select payment method
    User->>UI: Submit payment
    UI->>OrderService: updateOrderStatus(orderId, "preparing")
    OrderService->>Supabase: Update order status
    UI->>NotificationService: createNotification("Order preparing")
    NotificationService->>Supabase: Insert notification
    UI->>UI: Navigate to order tracking page
```

## Notes
- This diagram shows the full checkout flow from cart to payment completion
- The process includes order type selection with conditional fields
- Order creation occurs in the database before payment
- Cart items are converted to order items and saved
- Notifications are created at key points in the process
- The cart is cleared after successful order creation
