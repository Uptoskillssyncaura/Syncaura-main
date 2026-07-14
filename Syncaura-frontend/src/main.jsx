import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "./i18n/i18n";         
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import { MediaProvider } from './context/MediaContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <MediaProvider>
        <App />
      </MediaProvider>
    </Provider>
  </StrictMode>,
)

