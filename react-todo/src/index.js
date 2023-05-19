import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import SubTask from './components/subTask/App'
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element:<App />,
  },{
    path:"/:taskId/subtasks",
    element: <SubTask/>,
  },
  {
    path:"*",
    element:<Navigate to={"/"} replace/>
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

