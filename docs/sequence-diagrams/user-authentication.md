
# User Authentication Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant UI as Frontend UI
    participant AuthProvider as AuthProvider Component
    participant AuthService as AuthService
    participant Supabase as Supabase Auth
    participant DB as Database

    %% Login Flow
    User->>UI: Click "Sign In"
    UI->>UI: Navigate to /signin
    User->>UI: Enter email and password
    User->>UI: Submit login form
    UI->>AuthProvider: login(email, password)
    AuthProvider->>AuthService: signIn(email, password)
    AuthService->>Supabase: signInWithPassword(email, password)
    Supabase->>DB: Validate credentials
    DB-->>Supabase: Return session if valid
    Supabase-->>AuthService: Return user and session
    AuthService-->>AuthProvider: Return user profile
    AuthProvider->>AuthProvider: setUser(userProfile)
    AuthProvider->>UI: Display success toast
    AuthProvider->>UI: Navigate to "/"

    %% Error Handling
    Note over Supabase,AuthProvider: If authentication fails
    Supabase-->>AuthService: Return error
    AuthService-->>AuthProvider: Throw error
    AuthProvider->>UI: Display error toast
```

## Notes
- The diagram shows the login process flow through the application layers
- Error handling occurs if credentials are invalid
- Upon successful login, the user is redirected to the home page
- The AuthProvider maintains the authentication state throughout the app
