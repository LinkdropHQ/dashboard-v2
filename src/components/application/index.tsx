import React from 'react'
import { Provider } from 'react-redux'
import RouterProvider from './router-provider'
import store from 'data/store'

const initial = '75943743076957516542479869624300056629350467849611294422438007055230053645240'
const final = '75943743076957516542479869624300056629350467849611294422438007055230053646352'

class Application extends React.Component {
  
  render () {
    
    return <Provider store={store}>
      <RouterProvider />
    </Provider>
  }
}
export default Application
