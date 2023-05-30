import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Country from './components/country';
import StartPage from './components/start-page';
import MapEditor from './pages/map-editor';
import 'normalize.css';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <StartPage />,
  },
  {
    path: '/country',
    element: <Country />,
  },
  {
    path: '/battle',
    element: <App />,
  },
  {
    path: '/map-editor',
    element: <MapEditor />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
