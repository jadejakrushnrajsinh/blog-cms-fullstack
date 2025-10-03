# Anime Insights Blog CMS

A complete full-stack blog content management system with separate admin dashboard and public reader interface, built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Features

### Admin Dashboard

- User authentication (register/login)
- JWT-based authorization
- Create, read, update, delete blog posts
- Draft and published post statuses
- Image upload for posts
- Search and manage all posts
- Responsive admin interface

### Public Reader Blog

- Dynamic post loading from API
- Beautiful anime-themed design
- Search functionality across posts
- Category filtering
- Single post view with full content
- Responsive design for all devices
- Fallback to sample posts when API unavailable

### API Features

- RESTful API endpoints
- Public endpoint for published posts
- Secure authentication for admin operations
- Image upload handling
- CORS enabled for frontend integration

## Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend

- **HTML5** - Structure
- **CSS3** - Styling
- **JavaScript (ES6+)** - Interactivity
- **Font Awesome** - Icons

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone or download the project**

2. **Navigate to the project directory**

   ```bash
   cd blog-cms-fullstack
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/blogdb
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

   - `PORT`: Server port (default: 3000)
   - `MONGO_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT tokens

5. **Start MongoDB**

   Make sure MongoDB is running on your system:

   ```bash
   # On Windows
   net start MongoDB

   # On macOS
   brew services start mongodb/brew/mongodb-community

   # On Linux
   sudo systemctl start mongod
   ```

6. **Start the server**

   ```bash
   npm start
   ```

   For development with auto-restart:

   ```bash
   npm run dev
   ```

7. **Open your browser**

   Navigate to `http://localhost:3000` (or your configured port)

## Deployment

### MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**

   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account and cluster

2. **Get Connection String**
   - Go to "Clusters" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<database>` with your desired database name

### Heroku Deployment

1. **Install Heroku CLI**

   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**

   ```bash
   heroku login
   ```

3. **Create Heroku App**

   ```bash
   heroku create your-app-name
   ```

4. **Set Environment Variables**

   ```bash
   heroku config:set MONGO_URI="your-mongodb-atlas-connection-string"
   heroku config:set JWT_SECRET="your-super-secret-jwt-key-here"
   ```

5. **Deploy to Heroku**

   ```bash
   git push heroku master
   ```

6. **Open Your App**
   ```bash
   heroku open
   ```

### Alternative Deployment Options

#### Vercel (Frontend Only)

```bash
npm install -g vercel
vercel
```

#### Railway

- Connect your GitHub repository
- Automatic deployment with database provisioning

#### DigitalOcean App Platform

- Connect repository
- Automatic deployment with managed database

## Usage

### Accessing the Application

- **Reader Blog**: `http://localhost:3000` - Public blog interface
- **Admin Dashboard**: `http://localhost:3000/admin.html` - Content management

### Admin Setup

1. Navigate to `http://localhost:3000/admin.html`
2. Click "Register" to create an admin account
3. Fill in your details and register
4. Login with your credentials

### Creating Posts

1. In the admin dashboard, click "Create New" in the sidebar
2. Fill in the post details:
   - **Title**: Required
   - **Excerpt**: Optional brief description
   - **Content**: Required full content
   - **Image**: Optional image upload
   - **Status**: Draft or Published
3. Click "Save Draft" to save as draft or "Publish" to publish immediately

### Managing Posts

- **Dashboard**: View your recent posts
- **All Blogs**: View all your posts with search functionality
- **Edit**: Click "Edit" on any post to modify it
- **Delete**: Click "Delete" to remove a post (with confirmation)
- **View Blog**: Link to see published posts in reader interface

### Reader Experience

- Browse published posts with beautiful anime-themed design
- Search through all posts
- Filter by categories
- Click on posts to read full content
- Responsive design works on all devices

### API Endpoints

The application provides a REST API:

#### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

#### Posts

- `GET /api/posts/public` - Get all published posts (public)
- `GET /api/posts` - Get all posts (authenticated users only)
- `GET /api/posts/:id` - Get single post (authenticated users only)
- `POST /api/posts` - Create new post (authenticated)
- `PUT /api/posts/:id` - Update post (authenticated, owner only)
- `DELETE /api/posts/:id` - Delete post (authenticated, owner only)

## Project Structure

```
blog-cms-fullstack/
├── models/
│   ├── User.js          # User model
│   └── Post.js          # Post model
├── routes/
│   ├── auth.js          # Authentication routes
│   └── posts.js         # Post CRUD routes
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── public/
│   ├── index.html       # Reader blog interface
│   ├── admin.html       # Admin dashboard
│   ├── styles.css       # CSS styles
│   ├── app.js           # Admin dashboard JavaScript
│   └── uploads/         # Image storage directory
├── server.js            # Express server
├── package.json         # Dependencies and scripts
├── Procfile             # Heroku deployment
├── seed.js              # Database seeding
└── README.md            # This file
```

## Development

### Adding New Features

1. **Backend**: Add new routes in the `routes/` directory
2. **Frontend**: Modify `app.js` for new functionality
3. **Styling**: Update `styles.css` for UI changes

### Database Schema

#### User

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

#### Post

```javascript
{
  title: String,
  content: String,
  excerpt: String,
  author: ObjectId (ref: User),
  status: String (draft/published),
  createdAt: Date,
  updatedAt: Date
}
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Ensure MongoDB is running
   - Check the `MONGO_URI` in `.env`
   - For MongoDB Atlas, use the connection string provided

2. **Port Already in Use**

   - Change the `PORT` in `.env`
   - Or kill the process using the port

3. **Authentication Issues**

   - Check that `JWT_SECRET` is set
   - Ensure tokens aren't expired (24 hours by default)

4. **CORS Issues**
   - The backend is configured with CORS enabled
   - If running frontend separately, ensure proper CORS setup

### Logs

Check the console for error messages:

- **Backend**: Terminal where server is running
- **Frontend**: Browser developer tools console

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [ISC License](https://opensource.org/licenses/ISC).

## Support

If you encounter any issues or have questions:

1. Check the troubleshooting section
2. Review the code comments
3. Open an issue in the repository

---

**Happy blogging!** 📝
