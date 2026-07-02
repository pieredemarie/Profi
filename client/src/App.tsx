import {Header} from "./components/layout/Header/Header.tsx";
import {BlueBanner} from "./components/layout/BlueBanner/BlueBanner.tsx";
import {Footer} from "./components/layout/Footer/Footer.tsx";
import {Search} from "./components/layout/SearchBar/Search.tsx";
import {SoftwareTypesSection} from "./components/layout/SoftwareTypesSection/SoftwareTypesSection.tsx";
import {ProductCard} from "./components/ui/ProductCard/ProductCard.tsx";

function App() {

  return (
    <>
      <Header/>
        <ProductCard typeLabel="Антивирусное ПО"
                     title="Dr.Web Desktop Security Suite"
                     registryNumber="123"
                      replaces={["cisco","sad"]}
        />
        <Search/>
        <SoftwareTypesSection/>
        <BlueBanner/>
      <Footer/>
    </>
  )
}

export default App
