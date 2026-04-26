import { createBrowserRouter } from 'react-router-dom'
import App from '../App.jsx'
import BackendLayout from '../components/backendLayout.jsx'
import DashBoard from '../views/dashBoard.jsx'
import Cousutation from '../views/cousutation.jsx'
import Emotional from '../views/emotional.jsx'
import Knowledge from '../views/knowledge.jsx'
import { Navigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import Login from '../views/login.jsx'
import Register from '../views/register.jsx'



const backendRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/back',
    element: <BackendLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/back/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashBoard />,
      },
      {
        path: 'cousutation',
        element: <Cousutation />,

      },
      {
        path: 'emotional',
        element: <Emotional />,
      },
      {
        path: 'knowledge',
        element: <Knowledge />,
      },
    ],
  },
  {
    path:'/Auth',
    element:<AuthLayout />,
    children:[
      {
        path:'login',
        element:<Login />,

      },
      {
        path:'register',
        element:<Register />,
      },
    ]
  }
])

export default backendRouter
