
# Add to Cart Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant UI as Product Dialog
    participant Cart as Cart Context
    participant CartService as CartService
    participant Supabase as Supabase DB
    participant Toast as Toast Component

    %% Add Item Flow
    User->>UI: View product details
    User->>UI: Select product options/size
    User->>UI: Click "Add to Cart"
    UI->>UI: Validate selections
    Note over UI: Ensure options & size are selected if required
    UI->>Cart: addItem(product)
    Cart->>Cart: dispatch({ type: 'SET_LOADING', payload: true })
    
    alt User is authenticated
        Cart->>CartService: addItemToCart(item)
        CartService->>Supabase: insert into cart_items
        Supabase-->>CartService: Return added item
        CartService-->>Cart: Return item with ID
        Cart->>Cart: dispatch({ type: 'ADD_ITEM', payload: item })
    else User is guest
        Cart->>Cart: Generate local ID
        Cart->>Cart: dispatch({ type: 'ADD_ITEM', payload: item })
        Cart->>Cart: Save to localStorage
    end
    
    Cart->>Cart: dispatch({ type: 'SET_LOADING', payload: false })
    Cart-->>UI: Return from addItem function
    UI->>Toast: Show success toast
    UI->>UI: Close product dialog
```

## Notes
- The diagram shows the process of adding a product to the cart
- Different paths are taken depending on whether the user is authenticated
- For logged-in users, the item is stored in the database
- For guest users, the cart is saved in localStorage
- Input validation ensures required selections are made
