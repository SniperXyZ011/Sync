import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import HomePage from './components/HomePage.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import './App.css';
import { setOnlineUsers } from './redux/userSlice.js';
import { setSocket } from './redux/socketSlice.js';
import useAuthStatus from './hooks/useAuthStatus';

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
  const {socket} = useSelector(store=>store.socket);

  // Auth status check
  useAuthStatus();

  // Socket effect - Always declare the effect, but conditionally run the logic inside
  // useEffect(() => {
  //   let socketio = null;

  //   if (authUser) {
  //     socketio = io('http://localhost:8080', {
  //       query: {
  //         userId: authUser._id
  //       }
  //     });
      
  //     dispatch(setSocket(socketio));

  //     socketio.on('getOnlineUsers', (onlineUsers) => {
  //       dispatch(setOnlineUsers(onlineUsers));
  //     });
  //   } else {
  //     if (socket) {
  //       socket.close();
  //       dispatch(setSocket(null));
  //     }
  //   }

  //   // Cleanup function
  //   return () => {
  //     if (socketio) {
  //       socketio.close();
  //     }
  //   };
  // }, [authUser, dispatch, socket]);

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