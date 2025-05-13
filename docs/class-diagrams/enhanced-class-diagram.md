
# Enhanced Class Diagram

```mermaid
classDiagram
    %% User and Authentication
    class User {
        +uuid id
        +string email
        +string name
        +string avatar_url
        +datetime created_at
        +datetime updated_at
        +signIn(email, password)
        +signOut()
        +resetPassword(email)
        +updateProfile(data)
    }
    
    class AuthProvider {
        +User user
        +boolean isLoading
        +boolean isAuthenticated
        +login(email, password)
        +register(email, password, username)
        +logout()
        +resetPassword(email)
        +updateProfile(data)
    }
    
    %% Products
    class Product {
        +uuid id
        +string name
        +string description
        +uuid category_id
        +string image_url
        +number price_min
        +number price_max
        +datetime created_at
        +datetime updated_at
    }
    
    class ProductOption {
        +uuid id
        +string label
        +string value
        +number price_adjustment
        +datetime created_at
        +datetime updated_at
    }
    
    class ProductSize {
        +uuid id
        +string label
        +string value
        +number price
        +datetime created_at
        +datetime updated_at
    }
    
    class Category {
        +uuid id
        +string name
        +string description
        +datetime created_at
        +datetime updated_at
    }
    
    %% Cart
    class Cart {
        +uuid id
        +uuid user_id
        +datetime created_at
        +datetime updated_at
    }
    
    class CartItem {
        +uuid id
        +uuid cart_id
        +uuid product_id
        +number quantity
        +number price
        +string[] options
        +string size
        +uuid selected_option_id
        +uuid selected_size_id
        +datetime created_at
        +datetime updated_at
    }
    
    class CartProvider {
        +CartItem[] items
        +string cartId
        +boolean isLoading
        +addItem(item)
        +removeItem(itemId)
        +updateQuantity(itemId, quantity)
        +clearCart()
        +getCartTotal()
        +syncCart()
    }
    
    %% Orders
    class Order {
        +uuid id
        +uuid user_id
        +number subtotal
        +number tax
        +number tip
        +number delivery_fee
        +number total
        +string delivery_option
        +string delivery_address
        +string delivery_time
        +string status
        +datetime created_at
        +datetime updated_at
    }
    
    class OrderItem {
        +uuid id
        +uuid order_id
        +uuid product_id
        +string product_name
        +number quantity
        +string[] options
        +number price
        +string size
        +datetime created_at
        +datetime updated_at
    }
    
    %% Support
    class SupportTicket {
        +uuid id
        +uuid user_id
        +string issue_description
        +string status
        +datetime created_at
        +datetime updated_at
    }
    
    %% Campaigns
    class Campaign {
        +uuid id
        +string title
        +string description
        +string image_url
        +datetime start_date
        +datetime end_date
        +boolean is_active
        +datetime created_at
        +datetime updated_at
    }
    
    %% Notifications
    class Notification {
        +uuid id
        +uuid user_id
        +string message
        +string type
        +datetime created_at
    }
    
    %% Relationships
    User "1" -- "0..*" Order : places
    User "1" -- "0..1" Cart : owns
    User "1" -- "0..*" SupportTicket : creates
    User "1" -- "0..*" Notification : receives
    
    Category "1" -- "0..*" Product : categorizes
    
    Product "1" -- "0..*" CartItem : added to
    Product "1" -- "0..*" OrderItem : ordered as
    
    ProductOption "0..*" -- "0..*" CartItem : configures
    ProductSize "0..*" -- "0..*" CartItem : sizes
    
    Cart "1" -- "0..*" CartItem : contains
    Order "1" -- "0..*" OrderItem : contains
    
    AuthProvider -- User : manages
    CartProvider -- Cart : manages
    CartProvider -- CartItem : manages
```

## Notes
- This enhanced class diagram shows more detailed relationships between classes
- Attributes include database column types
- Methods represent key functionality in each class
- Relationships show cardinality (one-to-many, many-to-many, etc.)
- Provider classes represent React context providers that manage state
