import {Logo} from "../../ui/Logo/Logo.tsx";
import './Header.css'
interface HeaderProps {
    showShadow?: boolean;
}

export const Header = ({ showShadow = true }: HeaderProps) => {
    return (
        <header className={`header ${showShadow ? '' : 'header--no-shadow'}`}>
            <div className="header__container">
                <Logo/>
            </div>
        </header>
    )
}