import { ThemeProvider } from './context/ThemeContext'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Mixes } from './components/Mixes'
import { DJConsole } from './components/DJConsole'
import { Shows } from './components/Shows'
import { Gallery } from './components/Gallery'
import { Booking } from './components/Booking'
import { Newsletter } from './components/Newsletter'
import { Footer } from './components/Footer'

function Site() {
  return (
    <div style={{ fontFamily: 'var(--body)', color: 'var(--ink)', background: 'var(--bg)' }}>
      <Nav />
      <Hero />
      <About />
      <Mixes />
      <DJConsole />
      <Shows />
      <Gallery />
      <Booking />
      <Newsletter />
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Site />
    </ThemeProvider>
  )
}
