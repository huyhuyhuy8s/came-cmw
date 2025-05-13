
# Product Browsing Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant UI as Menu Page
    participant ProductService as Product Service
    participant ProductDialog as Product Dialog
    participant Supabase as Database
    participant CartContext as Cart Context

    %% Browse Products
    User->>UI: Navigate to menu page
    UI->>ProductService: getProducts(filters)
    ProductService->>Supabase: Query products table
    Supabase-->>ProductService: Return products list
    ProductService-->>UI: Return products
    UI->>UI: Display product cards
    
    %% Category Filtering
    User->>UI: Select category filter
    UI->>ProductService: getProductsByCategory(categoryId)
    ProductService->>Supabase: Query filtered products
    Supabase-->>ProductService: Return filtered products
    ProductService-->>UI: Return filtered products
    UI->>UI: Update product display
    
    %% View Product Details
    User->>UI: Click product card
    UI->>UI: Open product dialog with selected product
    UI->>ProductDialog: Show product details
    
    %% Product Options and Sizes
    ProductDialog->>ProductService: getProductOptions()
    ProductService->>Supabase: Query product_options table
    Supabase-->>ProductService: Return options
    ProductService-->>ProductDialog: Display options
    
    ProductDialog->>ProductService: getProductSizes()
    ProductService->>Supabase: Query product_sizes table
    Supabase-->>ProductService: Return sizes
    ProductService-->>ProductDialog: Display sizes
    
    %% Add to Cart
    User->>ProductDialog: Select options and size
    User->>ProductDialog: Set quantity
    User->>ProductDialog: Click "Add to Cart"
    ProductDialog->>CartContext: addItem(product with options)
    CartContext-->>ProductDialog: Return success
    ProductDialog->>UI: Close dialog and show confirmation
```

## Notes
- This diagram shows the user experience of browsing and selecting products
- Includes category filtering to find specific product types
- Detailed view shows product options and sizes
- Final step is adding the configured product to the cart
- The process is interactive with immediate UI updates
