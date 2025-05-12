
# Came Coffee Shop

## Running with Next.js and Turbopack

To run this project with Next.js and Turbopack without modifying package.json:

1. Install Next.js locally:
   ```
   npx -p next@latest -c "echo 'Next.js installed temporarily'"
   ```

2. Run the development server with Turbopack:
   ```
   node next-compat.js
   ```
   or directly:
   ```
   npx next dev --turbo
   ```

3. Build for production:
   ```
   npx next build
   ```

4. Deploy to Vercel:
   - Push your code to a Git repository
   - Import the project in Vercel dashboard
   - Vercel will automatically detect Next.js and deploy

## Original Vite Instructions

To run with original Vite setup:
```
npm run dev
```

