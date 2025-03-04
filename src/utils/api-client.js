import * as auth from 'auth-provider'
const apiURL = process.env.REACT_APP_API_URL

export * from './api-client.exercise'

  return window.fetch(`${apiURL}/${endpoint}`, config).then(async response => {
    if (response.status === 401) {
      await auth.logout()
      // refresh the page for them
      window.location.assign(window.location)
      return Promise.reject({message: 'Please re-authenticate.'})
    }
    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}

// 💯 automatically logout on 401
// export * from './api-client.extra-3'

// 💯 Support posting data
// export * from './api-client.extra-4'
