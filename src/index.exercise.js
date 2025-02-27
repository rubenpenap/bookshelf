import * as React from 'react'
import {createRoot} from 'react-dom/client'
import {Logo} from './components/logo'

function App() {
  return (
    <div>
      <Logo width="80" height="80" />
      <h1>Bookshelf</h1>
      <div>
        <button onClick={() => alert('Login')}>Login</button>
      </div>
      <div>
        <button onClick={() => alert('Register')}>Register</button>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
