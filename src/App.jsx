import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import KanbanDndKit from './componentes/KanbanDndKit.jsx'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <KanbanDndKit />
    </>
  )
}

export default App
