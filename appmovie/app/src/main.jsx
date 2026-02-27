// FORZAR MODO CLARO
document.documentElement.classList.remove("dark");

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Home } from './components/Home/Home'
import { PageNotFound } from './components/Home/PageNotFound'
import TableMovies from './components/Movie/TableMovies'
import { ListMovies } from './components/Movie/ListMovies'
import { DetailMovie } from './components/Movie/DetailMovie'
/////nuevo de cris de usaurio
import UserList from "@/components/User/UserList";
import UserDetail from "@/components/User/UserDetail";
/////nuevo de cris de funko
import FunkoList from "@/components/Funko/FunkoList";
import FunkoDetail from "@/components/Funko/FunkoDetail";
//import subasta
import { SubastaList } from "@/components/subasta/SubastaList";
import { SubastaDetail } from "@/components/subasta/SubastaDetail";
//import historial de pujas
import { HistorialPujas } from "@/components/pujas/HistorialPujas";
const rutas = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      // Ruta principal
      { index: true, element: <Home /> },

      // Ruta comodín (404)
      { path: "*", element: <PageNotFound /> },
       //Rutas componentes
      {path:"movie/table", element: <TableMovies/>},
      {path:"movie", element: <ListMovies/>},
      {path:"movie/detail/:id", element: <DetailMovie />},

      //rutas de usuariooooooooooooooooo
      { path: "users", element: <UserList /> },
      { path: "users/:id", element: <UserDetail /> },
      //rutas de funkooooooooooooooooo
      { path: "funkos", element: <FunkoList /> },
      { path: "funkos/:id", element: <FunkoDetail /> },
      //Rutas Subastas
      { path: "subastas", element: <SubastaList /> },
      { path: "subastas/:id", element: <SubastaDetail /> },
      //Ruta historial de pujas
      { path: "subastas/:id/pujas", element: <HistorialPujas /> },
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={rutas} />
  </StrictMode>,
)
