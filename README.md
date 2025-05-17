
# Social Network

A full-stack social network app built with Django (backend) and React (frontend). Users can register, post updates, follow/unfollow others, and like posts, with a responsive, dynamic interface.

---

## Features

- **User Registration & Authentication**
  - Register, login, logout, secure password handling.
- **User Profiles**
  - View user pages, see followers and following.
- **Follow System**
  - Follow/unfollow other users.
- **Posting**
  - Create, edit (own), and view posts, with paginated feeds.
- **Like System**
  - Like/unlike posts, see like counts.
- **SPA Frontend**
  - Fast, dynamic interface with React and AJAX calls.
- **API Endpoints**
  - JSON responses for easy frontend/backend integration.

---

## Backend (Django)

**Models**

- **User**: Extends Django’s `AbstractUser`.
  - Followers and following (self-referencing many-to-many).
  - `to_json(user)`: Outputs user info including follower status.
- **Post**: Linked to a User.
  - Text, timestamp, and likes (many-to-many).
  - `to_json(user)`: Outputs post details, like count, and user-specific info.

**Key Views**

- `compose`: Create a new post (POST, login required).
- `posts`: Get posts for all, a profile, or following (paginated JSON).
- `follow`: Follow/unfollow a user.
- `like`: Like/unlike a post.
- `edit`: Edit your own post.
- `login_view`, `logout_view`, `register`: User auth endpoints.
- `index`: Home page.

**API Usage**

- Most endpoints return or accept JSON for seamless SPA integration.
- Auth and permissions are enforced on sensitive actions.

---

## Frontend (React)

The frontend is implemented in `network/static/network/index.js` using React.

**Main Components**

- **Navbar**: Dynamically shows navigation and auth links.
- **Form**: For composing new posts (if logged in).
- **Post**: Displays each post, enabling edit, like, and profile view.
- **Page**: Renders a list of posts with pagination.
- **Profile**: Shows user info and follow/unfollow button.
- **App**: Main stateful component managing navigation, API calls, and rendering.

**Key Features**

- **SPA Routing & State**: Uses React state and effect hooks for dynamic view switching and data updates.
- **AJAX API Calls**: Uses `fetch` to communicate with all backend endpoints.
- **Optimistic UI**: UI updates instantly based on server responses for a snappy user experience.
- **Pagination**: Posts are paginated with next/previous and page numbers.
- **Conditional Rendering**: UI adapts to logged-in/logged-out state and current page.

---

## Getting Started

1. **Clone this repo**
2. **Install dependencies**
   ```bash
   pip install django
   ```
3. **Run migrations**
   ```bash
   python manage.py migrate
   ```
4. **Create a superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```
5. **Run the server**
   ```bash
   python manage.py runserver
   ```
6. **Access the app**
   - Visit `http://localhost:8000/` in your browser.

---

## File Structure

- `network/models.py` – Django models for User and Post.
- `network/views.py` – Django views for API endpoints and templates.
- `network/static/network/index.js` – React frontend SPA.

--
