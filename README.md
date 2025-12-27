# Express TypeScript PostgreSQL API

A robust and production-ready RESTful API built with TypeScript, Express, PostgreSQL, and Drizzle ORM. Features include JWT authentication, Google OAuth, rate limiting, email verification, password reset, and a complete todo management system.

## Features

### Core Stack

- **TypeScript**: Strongly-typed development for enhanced code quality and maintainability
- **Express**: Fast, minimalist web framework for Node.js
- **PostgreSQL**: Powerful, open-source relational database
- **Drizzle ORM**: Type-safe, lightweight ORM for PostgreSQL
- **Zod**: TypeScript-first schema validation for request validation

### Authentication & Security

- **JWT Authentication**: Secure token-based authentication
- **Google OAuth 2.0**: Social authentication with Google
- **Email Verification**: User email verification system with tokens
- **Password Reset**: Secure forgot password and reset password flow
- **Rate Limiting**: Global and endpoint-specific rate limiting
  - Global: 100 requests per 10 minutes
  - Auth endpoints: 1 request per 30 seconds (forgot password, request verification)
- **bcrypt**: Password hashing for secure credential storage

### Email System

- **Nodemailer**: Email service for verification and password reset
- **Email Templates**: Professional email templates for user communications

### Architecture

- **Modular Design**: Organized by Controllers, Services, Routes, Middlewares, and Validators
- **Custom Response Handlers**: Standardized API response format
- **Environment Configuration**: Centralized environment variable management
- **Error Handling**: Comprehensive error handling with detailed messages

## Tech Stack

| Category       | Technology                    |
| -------------- | ----------------------------- |
| Runtime        | Node.js                       |
| Language       | TypeScript                    |
| Framework      | Express.js                    |
| Database       | PostgreSQL                    |
| ORM            | Drizzle ORM                   |
| Validation     | Zod                           |
| Authentication | JWT + Passport (Google OAuth) |
| Security       | bcrypt, express-rate-limit    |
| Email          | Nodemailer                    |
| Dev Tools      | nodemon, tsx                  |

## API Endpoints

### Authentication Routes (`/auth`)

| Method | Endpoint                     | Description                | Rate Limited | Auth Required |
| ------ | ---------------------------- | -------------------------- | ------------ | ------------- |
| POST   | `/auth/register`             | Register new user          | ✓ Global     | ✗             |
| POST   | `/auth/login`                | Login with email/password  | ✓ Global     | ✗             |
| GET    | `/auth/me`                   | Get current user profile   | ✓ Global     | ✓             |
| POST   | `/auth/forgot-password`      | Request password reset     | ✓ 30s        | ✗             |
| POST   | `/auth/reset-password`       | Reset password with token  | ✓ Global     | ✗             |
| POST   | `/auth/request-verification` | Request email verification | ✓ 30s        | ✗             |
| GET    | `/auth/verify-email/:token`  | Verify email with token    | ✓ Global     | ✗             |
| GET    | `/auth/google`               | Initiate Google OAuth      | ✓ Global     | ✗             |
| GET    | `/auth/google/callback`      | Google OAuth callback      | ✓ Global     | ✗             |

### Todo Routes (`/todos`)

| Method | Endpoint     | Description        | Auth Required |
| ------ | ------------ | ------------------ | ------------- |
| POST   | `/todos`     | Create new todo    | ✓             |
| GET    | `/todos`     | Get all user todos | ✓             |
| GET    | `/todos/:id` | Get todo by ID     | ✓             |
| PUT    | `/todos/:id` | Update todo        | ✓             |
| DELETE | `/todos/:id` | Delete todo        | ✓             |

## Database Schema

### Users Table

```typescript
{
  id: uuid (primary key)
  name: string | null
  email: string (unique)
  password: string | null (nullable for OAuth users)
  googleId: string | null
  image: string | null
  isVerified: boolean (default: false)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Todos Table

```typescript
{
  id: uuid (primary key)
  userId: uuid (foreign key → users.id)
  title: string
  description: string | null
  status: boolean (default: false)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Verification Tokens Table

```typescript
{
  id: uuid (primary key)
  userId: uuid (foreign key → users.id)
  token: string (hashed)
  type: 'email_verification' | 'password_reset'
  expiresAt: timestamp
  createdAt: timestamp
}
```

## Prerequisites

Ensure you have the following installed:

- **Node.js** v18.x or higher
- **pnpm** (or npm/yarn)
- **PostgreSQL** v14.x or higher

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/express-drizzle-pg.git
cd express-drizzle-pg
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server
EXPRESS_PORT=8000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/dbname

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=7d

# Google OAuth
GOOGLE_OAUTH_CLIENT_ID=your-google-client-id
GOOGLE_OAUTH_CLIENT_SECRET=your-google-client-secret
GOOGLE_OAUTH_CALLBACK_URL=http://localhost:8000/auth/google/callback

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourapp.com
```

### 4. Database Setup

Generate migration files:

```bash
pnpm db:generate
```

Run migrations:

```bash
pnpm db:migrate
```

### 5. Start Development Server

```bash
pnpm dev
```

The server will start at `http://localhost:8000`

## Available Scripts

| Script             | Description                                |
| ------------------ | ------------------------------------------ |
| `pnpm dev`         | Start development server with hot reload   |
| `pnpm build`       | Compile TypeScript to JavaScript           |
| `pnpm start`       | Run compiled production build              |
| `pnpm typecheck`   | Run TypeScript type checking               |
| `pnpm lint`        | Run ESLint                                 |
| `pnpm lint:fix`    | Fix ESLint errors and format with Prettier |
| `pnpm db:generate` | Generate Drizzle migration files           |
| `pnpm db:migrate`  | Run database migrations                    |

## Project Structure

```
express-drizzle-pg/
├── src/
│   ├── config/          # Configuration files (env, database, OAuth)
│   ├── controllers/     # Request handlers
│   ├── db/             # Database schema and client
│   ├── middlewares/    # Custom middleware (auth, rate limiting)
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic layer
│   ├── types/          # TypeScript type definitions
│   ├── validators/     # Zod validation schemas
│   └── index.ts        # Application entry point
├── drizzle/            # Database migrations
├── .env                # Environment variables
├── package.json
└── tsconfig.json
```

## Example Usage

### Register a New User

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Login

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Get Current User

```bash
curl -X GET http://localhost:8000/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create a Todo

```bash
curl -X POST http://localhost:8000/todos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "description": "Finish the API documentation"
  }'
```

## Rate Limiting

This API implements rate limiting to prevent abuse:

- **Global Rate Limit**: 100 requests per 10 minutes per IP address
- **Auth Endpoints** (`/forgot-password`, `/request-verification`): 1 request per 30 seconds per IP

When rate limit is exceeded, you'll receive a `429 Too Many Requests` response.

## Security Features

✅ Password hashing with bcrypt  
✅ JWT token-based authentication  
✅ Rate limiting on sensitive endpoints  
✅ Email verification for new accounts  
✅ Secure password reset flow with expiring tokens  
✅ Input validation with Zod  
✅ SQL injection prevention via Drizzle ORM  
✅ Environment variable protection

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgements

Special thanks to the creators and maintainers of:

- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Express](https://expressjs.com/) - Web framework
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Drizzle ORM](https://orm.drizzle.team/) - Type-safe ORM
- [Zod](https://zod.dev/) - Schema validation
- [Passport](http://www.passportjs.org/) - Authentication middleware
- [Nodemailer](https://nodemailer.com/) - Email service
