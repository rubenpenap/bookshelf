import * as React from 'react'
import {createRoot} from 'react-dom/client'
import {Dialog} from '@reach/dialog'
import {Logo} from './components/logo'
import '@reach/dialog/styles.css'

function LoginForm({onSubmit, buttonText}) {
  function handleSubmit(event) {
    event.preventDefault()
    const {username, password} = event.target.elements

    onSubmit({
      username: username.value,
      password: password.value,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
        <input id="username" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" />
      </div>
      <div>
        <button type="submit">{buttonText}</button>
      </div>
    </form>
  )
}

function App() {
  const [openDialog, setOpenDialog] = React.useState('none')

  function login(formData) {
    console.log('login', formData)
  }

  function register(formData) {
    console.log('register', formData)
  }

  return (
    <div>
      <Logo width="80" height="80" />
      <h1>Bookshelf</h1>
      <div>
        <button onClick={() => setOpenDialog('login')}>Login</button>
      </div>
      <div>
        <button onClick={() => setOpenDialog('register')}>Register</button>
      </div>
      <Dialog aria-label="Login form" isOpen={openDialog === 'login'}>
        <div>
          <button onClick={() => setOpenDialog('none')}>Close</button>
        </div>
        <LoginForm onSubmit={login} buttonText="Login" />
      </Dialog>
      <Dialog aria-label="Registration form" isOpen={openDialog === 'register'}>
        <div>
          <button onClick={() => setOpenDialog('none')}>Close</button>
        </div>
        <LoginForm onSubmit={register} buttonText="Register" />
      </Dialog>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
