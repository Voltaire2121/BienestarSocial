import './App.css'
import ClientScreen from './screens/ClientsScreen/ClientsScreen'
import MainHeader from './components/MainHeader/main-header'
import { useAuth } from './services/firebase'
import LoginScreen from './screens/LoginScreen/login-screen'

function App() {
  const isLoggedIn = useAuth().isLoggedIn
  return (
    <div className="parentDiv">
      {!isLoggedIn && <LoginScreen />}
      {isLoggedIn && (
        <>
          <MainHeader />
          <ClientScreen />
        </>
      )}
    </div>
  )
}

export default App
