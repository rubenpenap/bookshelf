import * as React from 'react'
import {createRoot} from 'react-dom'
import {Logo} from './components/logo'

function App() {
  return (
    <div>
      <Logo />
      <h1>Bookshelf</h1>
      <div>
        <button onClick={() => alert('Login')}>Login</button>
        <button onClick={() => alert('Register')}>Register</button>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
