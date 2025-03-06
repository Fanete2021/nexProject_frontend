import {Suspense, useState} from 'react'
import { AuthPage } from "@/pages/auth-page/index.ts";
import './styles/index.scss';
import { Loader } from "@/shared/ui";
import AppRouter from "./providers/router/AppRouter.tsx";

const App = () => {
  return (
    <div id="app">
      <Suspense fallback={<Loader />}>
        <AppRouter />
      </Suspense>
    </div>
  )
}

export default App
