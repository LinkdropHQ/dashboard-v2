import React from 'react'
import { Provider } from 'react-redux'
import RouterProvider from './router-provider'
import store from 'data/store'

console.log({ store: store.dispatch })

class Application extends React.Component {
  render () {
    return <Provider store={store}>
      <RouterProvider />
    </Provider>
  }
}
export default Application
