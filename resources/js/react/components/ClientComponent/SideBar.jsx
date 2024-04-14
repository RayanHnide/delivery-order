import {NavLink, useLocation, useNavigate} from 'react-router-dom';
import {AuthHelper} from "../../tools/AuthHelper.js";
import {Api} from "../../tools/ApiHelper.js";
import {useState} from "react";
import {
    CDBSidebar,
    CDBSidebarContent, CDBSidebarFooter,
    CDBSidebarHeader,
    CDBSidebarMenu,
    CDBSidebarMenuItem
} from "cdbreact";

export default function Sidebar({routes}) {
    const {pathname} = useLocation()
    const navigate = useNavigate();
    const [toggled, setToggled] = useState(true)
    const onLogout = () => {
        Api.post({
            path: "/logout"
        }).finally(() => {
            AuthHelper.logout();
            navigate("/")
        })
    }
    return (
        <div onMouseEnter={() => setToggled(false)} onMouseLeave={() => setToggled(true)} className="position-fixed z-3" style={{
            display: 'flex',
            height: 'calc(70% - 100px)',
            top: "calc(15% + 100px)",
            overflow: 'scroll initial'
        }}>
            <CDBSidebar toggled={toggled} textColor="#fff" backgroundColor="rgba(248, 234, 32, 0.51)">
                <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
                    {AuthHelper.user()?.name?.toUpperCase()}
                    <div className="text-small">{AuthHelper.role()}</div>
                </CDBSidebarHeader>
                <CDBSidebarContent className="sidebar-content overflow-auto">
                    <CDBSidebarMenu>
                        {
                            routes.map((m) => {
                                const isActive = `/dashboard/${m.path}` === pathname;
                                return <NavLink key={m.label} to={`/dashboard/${m.path}`}>
                                    <CDBSidebarMenuItem active={isActive} icon={m.icon}>
                                        {m.label}
                                    </CDBSidebarMenuItem>
                                </NavLink>
                            })
                        }
                    </CDBSidebarMenu>
                </CDBSidebarContent>
                <CDBSidebarFooter style={{textAlign: 'center'}}>
                    <div onClick={onLogout}>
                        <CDBSidebarMenuItem className="btn btn-danger m-0 p-0 mb-1" icon="arrow-down">
                            LOGOUT
                        </CDBSidebarMenuItem>
                    </div>
                </CDBSidebarFooter>
            </CDBSidebar>
        </div>
    )
}
