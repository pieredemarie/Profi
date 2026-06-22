import {Logo} from "../../ui/Logo/Logo.tsx";
import './Header.css'
export const Header:React.FC = () => {
    return (
        <header className="header">
            <div className="header__container">
                <Logo/>
            </div>
        </header>
    )
}