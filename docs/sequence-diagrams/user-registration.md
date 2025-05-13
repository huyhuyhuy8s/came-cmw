
# User Registration Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant UI as Sign Up Page
    participant AuthProvider as Auth Provider
    participant AuthService as Auth Service
    participant Supabase as Supabase Auth
    participant DB as Database
    participant Toast as Toast Component
    participant CartSync as Cart Syncing

    %% Registration Flow
    User->>UI: Navigate to /signup
    User->>UI: Enter username, email, password
    User->>UI: Submit registration form
    UI->>UI: Validate form fields
    UI->>AuthProvider: register(email, password, username)
    AuthProvider->>AuthService: signUp(email, password, username)
    AuthService->>Supabase: signUp(email, password)
    Supabase->>DB: Create user record
    Supabase-->>AuthService: Return user data
    
    AuthService->>DB: Create user profile
    DB-->>AuthService: Return profile data
    AuthService-->>AuthProvider: Return user profile
    AuthProvider->>AuthProvider: setUser(userProfile)
    AuthProvider->>Toast: Show success message
    
    %% Cart Syncing after Registration
    AuthProvider->>CartSync: syncCart()
    CartSync->>DB: Transfer local cart to database
    DB-->>CartSync: Confirm cart transfer
    
    AuthProvider->>UI: Navigate to home page
```

## Notes
- The diagram shows the user registration process
- Form validation occurs before submission
- User account is created in the auth system
- User profile is created in the database
- Cart items from localStorage are synced to the database
- User is redirected to the home page after successful registration
