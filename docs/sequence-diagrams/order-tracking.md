
# Order Tracking Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant UI as Order Tracking Page
    participant OrderService as Order Service
    participant ItemService as Order Item Service
    participant Supabase as Database
    participant Toast as Toast Component

    %% Order Tracking
    User->>UI: Navigate to order tracking page
    UI->>UI: Extract orderId from URL
    UI->>OrderService: getOrderById(orderId)
    OrderService->>Supabase: Query orders table
    Supabase-->>OrderService: Return order data
    OrderService-->>UI: Return order details
    
    UI->>ItemService: getOrderItems(orderId)
    ItemService->>Supabase: Query order_items table
    Supabase-->>ItemService: Return order items
    ItemService-->>UI: Return item details
    
    UI->>UI: Display order status and progress
    UI->>UI: Display order items and details
    
    alt User cancels order
        User->>UI: Click "Cancel Order"
        UI->>OrderService: cancelOrder(orderId)
        OrderService->>Supabase: Update order status to "cancelled"
        Supabase-->>OrderService: Return updated order
        OrderService-->>UI: Return success
        UI->>UI: Update order status display
        UI->>Toast: Show cancellation confirmation
    end
```

## Notes
- This diagram shows the process of tracking an order's status
- The order details and items are fetched separately
- Order status is displayed with a visual progress indicator
- Users can cancel their order if it's in an appropriate status
- The UI is updated immediately upon cancellation
