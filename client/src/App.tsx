import {MainPage} from "./pages/MainPage.tsx";
import {ResultsPage} from "./pages/ResultsPage.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";


function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/results" element={<ResultsPage />} />
          </Routes>
      </BrowserRouter>
  )
}

export default App
