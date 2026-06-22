import LogoImg from '../../../assets/logo.png'
import * as React from "react";
import './Logo.css'
export const Logo : React.FC = () => {
    return (
        <div className="logo-wrapper">
            <img src={LogoImg} alt="логотип" className="logo-img" />
        </div>
    )
}