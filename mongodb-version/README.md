# Netwat Corp Task - MongoDB Version

## Installation

This project uses `yarn` as the package manager.

1. Install dependencies:
   ```sh
   yarn install
   ```
2. Set up environment variables:
   - Refer to `.env.example` for all required environment variables.
3. Start the development server:
   ```sh
   yarn dev
   ```

## Available Scripts

Additional scripts are available in `package.json`. Some useful ones include:

- **Start Development Server**: `yarn dev`
- **Build Project**: `yarn build`
- **Start Production Server**: `yarn start`
- **Run Linter**: `yarn lint`

## API Documentation

Swagger API documentation is available at:
- [Swagger Docs](http://localhost:8000/docs)
- Server runs at: [http://localhost:8000](http://localhost:8000)

## Authentication & Authorization

This project implements authentication and authorization using JWT. The system supports:

- **Access Tokens**
- **Refresh Tokens**

### User Roles

- **Admin**: Has full access to all functionalities.
- **User**: Limited access based on permissions.

## Caching

To demonstrate caching skills, `node-cache` is used for simple in-memory caching solutions.

## Project Structure

This project follows a structured backend architecture with separate modules for controllers, services, and database interactions.

## Summary

This solution was developed for Netwat Corp as part of their technical task. It demonstrates efficient use of MongoDB, authentication, caching, and structured API design. I hope it meets expectations and showcases my backend development skills effectively.
