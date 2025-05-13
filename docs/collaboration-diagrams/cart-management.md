
# Cart Management Collaboration Diagram

```mermaid
flowchart TB
    User((User))
    UI[Product Dialog]
    CartContext[Cart Context]
    CartService[Cart Service]
    LocalStorage[Local Storage]
    Database[(Supabase Database)]
    Toast[Toast Component]
    
    User -->|1. Select product| UI
    User -->|2. Configure options| UI
    User -->|3. Click Add to Cart| UI
    UI -->|4. Call addItem()| CartContext
    
    subgraph AuthCheck[Authentication Check]
        CartContext -->|5a. If authenticated| CartService
        CartContext -->|5b. If guest| LocalStorage
    end
    
    CartService -->|6a. Insert cart_item| Database
    Database -->|7a. Return item with ID| CartService
    CartService -->|8a. Return item| CartContext
    
    LocalStorage -->|6b. Save cart| LocalStorage
    LocalStorage -->|7b. Return success| CartContext
    
    CartContext -->|9. Update state| CartContext
    CartContext -->|10. Return success| UI
    UI -->|11. Show confirmation| Toast
    
    subgraph CartSyncFlow[Cart Synchronization]
        User -->|1. Sign in| AuthContext
        AuthContext -->|2. Call syncCart()| CartContext
        CartContext -->|3. Get local items| LocalStorage
        CartContext -->|4. Clear remote cart| CartService
        CartService -->|5. Delete from DB| Database
        CartContext -->|6. Add each item| CartService
        CartService -->|7. Insert items| Database
        Database -->|8. Return new items| CartService
        CartService -->|9. Return items| CartContext
        CartContext -->|10. Update state| CartContext
    end
```

## Notes
- This diagram shows both adding items to cart and cart synchronization flows
- Authentication state determines whether items are stored locally or in the database
- The cart synchronization flow occurs when a user signs in with existing local cart items
