import React from 'react'
// import ReactDOM from 'react-dom/client'
import App from './App'

import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'

const container = document.getElementById('root')!
const root = createRoot(container)

root.render(
  <React.StrictMode>
        <HashRouter>
        <App />
      </HashRouter>
  </React.StrictMode>,
)


// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//   <React.StrictMode>
//         <HashRouter>
//         <App />
//       </HashRouter>
//   </React.StrictMode>,
// )
