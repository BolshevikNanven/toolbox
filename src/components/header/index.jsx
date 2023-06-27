import React from "react";
import './header.css';

function Header(props){
    return(
    <div className="mainHeaderBox">
        <header className="mainHeader">
            <div className="mainHeaderTitle">{props.title}</div>
            <div className="mainHeaderMid"></div>
            <div className="mainHeaderLst">{props.children}</div>
        </header>
    </div>
        
    )
}

export default Header;