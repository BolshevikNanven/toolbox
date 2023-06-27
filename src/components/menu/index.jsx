import React,{useEffect, useRef, useState} from "react";
import { Link,useResolvedPath,useMatch} from "react-router-dom";
import './menu.css';

import { Tooltip } from '@mui/material';

import { Icon as FluentIcon } from '@fluentui/react/lib/Icon';

function CustomLink({cExmenuBlankTop=()=>{}, className,children, to, ...props }) {
    let resolved = useResolvedPath(to);
    let match = useMatch({ path: resolved.pathname, end: true });

    const ref=useRef();

    //useEffect(()=>{
    //    if(match){
    //        cExmenuBlankTop(ref.current.offsetTop);
    //    }
    //});
    
    return (
        <Link
            onDragStart={e=>e.preventDefault()}
            ref={ref}
            className={`${className} ${match? 'active' :undefined}`}
            to={to}
            {...props}
        >
            {children}
        </Link>
    );
}

function Menu(){
    
    const [menuState,ExmenuState]=useState(false);
    const menuRef=useRef();

    //菜单指示条动画----
    //const PremenuBlankTopRef=useRef();
    //const PremenuBlankTop=PremenuBlankTopRef.current;
    //useEffect(()=>{
    //    if(PremenuBlankTop-menuBlankTop!==0){
    //        if(PremenuBlankTop>menuBlankTop){
    //            menuBlankRef.current.style.bottom=menuRef.current.clientHeight-PremenuBlankTop-46+'px';
    //            menuBlankRef.current.style.top='unset';
    //        }else{
    //            menuBlankRef.current.style.top=PremenuBlankTop +'px';
    //            menuBlankRef.current.style.bottom='unset';
    //        }
    //        setTimeout(()=>{
    //            menuBlankRef.current.style.height=Math.abs(PremenuBlankTop-menuBlankTop)+18+"px";
    //        },160);
    //       setTimeout(()=>{
    //            if(PremenuBlankTop>menuBlankTop){
    //                menuBlankRef.current.style.bottom='unset';
    //                menuBlankRef.current.style.top=menuBlankTop+'px';
    //            }else{
    //                menuBlankRef.current.style.top='unset';
    //                menuBlankRef.current.style.bottom=menuRef.current.clientHeight-menuBlankTop-46+'px';
    //            }
    //            menuBlankRef.current.style.height='18px';
    //        },308);
    //   }
    //    PremenuBlankTopRef.current=menuBlankTop;
    //});
    //---------------


    return(
        <div className={`menuBox ${menuState? 'open': ''}`}>
            <div className="menu" ref={menuRef}>
                <button onClick={ ()=>ExmenuState(menuState => !menuState) } className="menuBtnS">
                    <Tooltip title="菜单" enterDelay={800} placement="right">
                        <div className="menuBtnIcon">
                            <FluentIcon iconName="GlobalNavButton" />
                        </div>
                    </Tooltip>                    
                </button>
                <CustomLink   to="/" className="menuBtn">
                    <Tooltip title="主页" enterDelay={800} placement="right">
                        <div className="menuBtnIcon">
                            <FluentIcon iconName="Home" />
                        </div>
                    </Tooltip>                   
                    <div className="menuname">主页</div>
                </CustomLink>
                <CustomLink   to="/calendar" className="menuBtn">
                    <Tooltip title="日历" enterDelay={800} placement="right">
                        <div className="menuBtnIcon">
                            <FluentIcon iconName="Calendar" />
                        </div>
                    </Tooltip>                   
                    <div className="menuname">日历</div>
                </CustomLink>
                <CustomLink  to="/todo" className="menuBtn">
                    <Tooltip title="待办事项" enterDelay={800} placement="right">
                        <div className="menuBtnIcon">
                            <FluentIcon iconName="ToDoLogoOutline" />
                        </div>
                    </Tooltip>                  
                    <div className="menuname">待办事项</div>
                </CustomLink>
                <CustomLink  to="/check" className="menuBtn">
                    <Tooltip title="记账" enterDelay={800} placement="right">
                        <div className="menuBtnIcon">
                            <FluentIcon iconName="Money" />
                        </div>
                    </Tooltip>                   
                    <div className="menuname">记账</div>
                </CustomLink>
                <CustomLink  to="/count" className="menuBtn">
                    <Tooltip title="倒数日" enterDelay={800} placement="right">
                        <div className="menuBtnIcon">
                            <FluentIcon iconName="AlarmClock" />
                        </div>
                    </Tooltip>
                    <div className="menuname">倒数日</div>
                </CustomLink>
            </div>
            <div className="menub">
                <a className="menuBtn">
                    <Tooltip title="账户" enterDelay={800} placement="right">
                        <div className="menuBtnIcon">
                            <FluentIcon iconName="Contact" />
                        </div>
                    </Tooltip>
                    <div className="menuname">账户</div>
                </a>
                <a className="menuBtn">
                    <Tooltip title="设置" enterDelay={800} placement="right">
                        <div className="menuBtnIcon">
                            <FluentIcon iconName="Settings" />
                        </div>
                    </Tooltip>
                    <div className="menuname">设置</div>
                </a>
            </div>
        </div>
    )
}

export default Menu;