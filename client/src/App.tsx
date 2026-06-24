import {Header} from "./components/layout/Header/Header.tsx";
import {Search} from "./components/layout/Search/Search.tsx";
import {BlueBanner} from "./components/layout/BlueBanner/BlueBanner.tsx";
import {Footer} from "./components/layout/Footer/Footer.tsx";

function App() {

  return (
    <>
      <Header/>
        <Search/>
        <BlueBanner/>
      <Footer/>
    </>
  )
}

export default App
