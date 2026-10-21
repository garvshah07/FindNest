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
  redux/                  # Redux store, reducers, and thunk middleware setup
```

The app uses React Router's `createBrowserRouter` and `RouterProvider`.
Open `src/App.jsx` to see every route.

## Redux

The Redux store is configured in `src/redux/store.js` and provided to the app
from `src/main.jsx`. Redux Thunk is already enabled, so asynchronous action
creators can be dispatched from components with `dispatch`.

The current store contains an `auth` slice:

```js
{
  auth: {
    user: null,
    token: null,
    resetToken: null,
    loading: false,
    error: null,
  },
  users: [],
  properties: [],
}
```

Use `useSelector` to read state and `useDispatch` to dispatch actions or thunk
action creators.

### API thunks

Requests use `VITE_API_URL` when it is configured, or default to
`http://localhost:3000/api`. The shared request helper automatically adds the
stored bearer token.

The Redux folder has only four files:

- `api.js`: common `fetch` helper
- `actions.js`: all API requests and Redux actions
- `reducers.js`: auth, users, and properties state
- `store.js`: combines reducers and enables Redux Thunk

For example:

```js
import { login } from "../redux/actions";

const result = await dispatch(login({ email, password }));
```

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
