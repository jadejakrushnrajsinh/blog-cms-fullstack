# Blog CMS Full-Stack Application

A complete full-stack blog content management system built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Features

- User authentication (register/login)
- JWT-based authorization
- Create, read, update, delete blog posts
- Draft and published post statuses
- Responsive UI with modern design
- Search functionality
- RESTful API

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

## Usage

### First Time Setup

1. Open the application in your browser
2. Click "Register" to create a new account
3. Fill in your details and register
4. Login with your credentials

### Creating Posts

1. After logging in, click "Create New Post" or go to "Create New" in the sidebar
2. Fill in the post details:
   - **Title**: Required
   - **Excerpt**: Optional brief description
   - **Content**: Required full content
   - **Status**: Draft or Published
3. Click "Save Draft" to save as draft or "Publish" to publish immediately

### Managing Posts

- **Dashboard**: View your recent posts
- **All Blogs**: View all your posts with search functionality
- **Edit**: Click "Edit" on any post to modify it
- **Delete**: Click "Delete" to remove a post (with confirmation)

### API Endpoints

The application provides a REST API:

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

#### Posts (require authentication)
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

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
├── index.html           # Main HTML file
├── styles.css           # CSS styles
├── app.js              # Frontend JavaScript
├── server.js           # Express server
├── package.json        # Dependencies and scripts
└── README.md           # This file
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
