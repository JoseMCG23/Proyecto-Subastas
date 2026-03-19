// FORZAR MODO CLARO
//document.documentElement.classList.remove("dark");

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
/////nuevo de cris de usuario
import UserList from "@/components/User/UserList";
import UserDetail from "@/components/User/UserDetail";



//nuevo actualizar usuario
import UserUpdate from "@/components/User/UserUpdate";




/////nuevo de cris de funko
import FunkoList from "@/components/Funko/FunkoList";
import FunkoCreate from "@/components/Funko/FunkoCreate";
import FunkoUpdate from "@/components/Funko/FunkoUpdate";
import FunkoDetail from "@/components/Funko/FunkoDetail";

//import subasta
import { SubastaCatalogo } from "@/components/subasta/SubastaCatalogo";
import { SubastaVista } from "@/components/subasta/SubastaVista";
//import historial de pujas 
import { HistorialPujas } from "@/components/pujas/HistorialPujas";

//import manntenimiento subasta
import { MantenimientoSubasta } from "@/components/subasta/MantenimientoSubasta";


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
      { path: "users/update/:id", element: <UserUpdate /> },
   
      //rutas de funkooooooooooooooooo
      { path: "funkos", element: <FunkoList /> },
      { path: "funkos/create", element: <FunkoCreate /> },
      {
        path: "funkos/update/:id",
        element: <FunkoUpdate />,
      },
      { path: "funkos/:id", element: <FunkoDetail /> },
     
    //Rutas actualizar usuario
   
      //Rutas Subastas
      { path: "subastas", element: <SubastaCatalogo /> },
      { path: "subastas/:id", element: <SubastaVista /> },
      //Ruta historial de pujas
      { path: "subastas/:id/pujas", element: <HistorialPujas /> },
      //Ruta mantenimiento subasta
      {path: "mantenimiento-subastas", element: <MantenimientoSubasta />},
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={rutas} />
  </StrictMode>,
)
