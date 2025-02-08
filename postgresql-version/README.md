# Netwat Corp Task PostgreSQL Version

## Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies using Yarn:
   ```sh
   yarn install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` and fill in the required values.

4. Start the development server:
   ```sh
   yarn dev
   ```

## Project Details

- **Database**: PostgreSQL
- **Authentication & Authorization**: JWT-based authentication with access and refresh tokens.
- **User Roles**: `admin`, `user`
- **Caching**: Implemented using `node-cache` for performance optimization.
- **API Documentation**: Available at [http://localhost:8000/docs](http://localhost:8000/docs).
- **Server**: Runs on [http://localhost:8000](http://localhost:8000).

## Additional Information

- The project follows a structured backend architecture.
- Implements optimized database queries for better performance.
- Various scripts are available in `package.json` for testing, linting, and building.

This implementation showcases PostgreSQL integration while maintaining a clean and scalable Node.js backend solution. 🚀
