import {Header} from "./components/layout/Header/Header.tsx";
import {Search} from "./components/layout/Search/Search.tsx";
import {BlueBanner} from "./components/layout/BlueBanner/BlueBanner.tsx";

function App() {

  return (
    <>
      <Header/>
        <Search/>
        <BlueBanner/>
    </>
  )
}

export default App
