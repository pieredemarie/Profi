import {Header} from "./components/layout/Header/Header.tsx";
import {BlueBanner} from "./components/layout/BlueBanner/BlueBanner.tsx";
import {Footer} from "./components/layout/Footer/Footer.tsx";
import {Search} from "./components/layout/SearchBar/Search.tsx";
import {SoftwareTypesSection} from "./components/layout/SoftwareTypesSection/SoftwareTypesSection.tsx";


function App() {

  return (
    <>
      <Header/>

        <Search/>
        <SoftwareTypesSection/>
        <BlueBanner/>
      <Footer/>
    </>
  )
}

export default App
