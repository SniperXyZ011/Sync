import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import HomePage from './components/HomePage.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import './App.css';
import { setOnlineUsers } from './redux/userSlice.js';
import useAuthStatus from './hooks/useAuthStatus';
import { socketManager } from './utils/socketManager.js';

// Move router creation outside component
const createRouter = (authUser) => createBrowserRouter([
  { 
    path: "/", 
    element: authUser ? <HomePage /> : <Navigate to="/login" /> 
  },
  { 
    path: "/signup", 
    element: !authUser ? <Signup /> : <Navigate to="/" /> 
  },
  { 
    path: "/login", 
    element: !authUser ? <Login /> : <Navigate to="/" /> 
  }
]);

function App() { 
  const dispatch = useDispatch();
  const {authUser, isLoading} = useSelector(store=>store.user);

  // Auth status check
  useAuthStatus();

  // Socket effect - Always declare the effect, but conditionally run the logic inside
  useEffect(() => {
    if (authUser) {
      const socket = socketManager.connect(authUser._id);
      
      socket.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });
    } else {
      socketManager.disconnect();
    }

    // Cleanup function
    return () => {
      socketManager.disconnect();
    };
  }, [authUser, dispatch]);

  // Create router - do this after all hooks
  const router = createRouter(authUser);

  // Render loading state or router
  return (
    <div className="p-4 h-screen flex items-center justify-center">
      {isLoading ? (
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      ) : (
        <RouterProvider router={router} />
      )}
    </div>
  );
}

export default App;