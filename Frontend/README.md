# FindNest Frontend

This is the React frontend for FindNest. The backend is a separate project and
is not part of this folder.

## Folder structure

```text
src/
  App.jsx                 # All frontend routes (createBrowserRouter)
  main.jsx                # Starts React
  index.css               # Global styles
  components/             # Reusable pieces used by multiple pages
  pages/                  # Full screens shown by the routes
```

The app uses React Router's `createBrowserRouter` and `RouterProvider`.
Open `src/App.jsx` to see every route.

## Routes

Routes are defined in `src/App.jsx`:

| URL | Page | Purpose |
| --- | --- | --- |
| `/login` | `Login.jsx` | Sign in |
| `/signup` | `Signup.jsx` | Create an account |
| `/forgot-password` | `ForgotPassword.jsx` | Reset a password |

The `/` URL and unknown URLs redirect to `/login`.

## Run the frontend

From this folder:

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run lint
npm run build
```
