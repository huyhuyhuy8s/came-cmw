
# Support Ticket Creation Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant UI as Support Form
    participant AuthContext as Auth Context
    participant SupportService as Support Service
    participant Supabase as Database
    participant Toast as Toast Component

    %% Support Ticket Creation
    User->>UI: Navigate to support page
    User->>UI: Enter issue description
    User->>UI: Submit support ticket
    UI->>UI: Validate form (description not empty)
    UI->>AuthContext: Check user authentication
    
    alt User is authenticated
        UI->>UI: Set isSubmitting(true)
        UI->>SupportService: createSupportTicket(data)
        SupportService->>Supabase: Insert support_ticket
        Supabase-->>SupportService: Return created ticket
        SupportService-->>UI: Return success
        UI->>UI: setIsSubmitted(true)
        UI->>UI: Reset form
        UI->>Toast: Show success message
    else User not authenticated
        UI->>Toast: Show "Sign in required" message
    end
    
    UI->>UI: Set isSubmitting(false)
```

## Notes
- The diagram shows the process of creating a support ticket
- Authentication check is performed before submission
- Form validation ensures the description is not empty
- Success state is shown after successful submission
- The form is reset for potential future submissions
