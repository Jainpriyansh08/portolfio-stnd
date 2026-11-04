import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const root = document.getElementById('root')
const app = <StrictMode><App /></StrictMode>
// The build prerenders the page into #root, so hydrate when markup exists.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
