import MainApp from './MainApp';
import { AuthProvider } from './auth-context';

function App() {

  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  )
}

export default App
