// App.js
import NotesProvider from "./context/NotesContext"  // Note: import NotesProvider, not NotesContext
import Notespage from "./pages/Notespage"

function App() {
  return (
    <div id="app">
      <NotesProvider>
        <Notespage/>
      </NotesProvider>
    </div>
  )
}

export default App