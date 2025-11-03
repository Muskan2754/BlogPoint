// import { useContext, useEffect, useRef, useState } from "react";
// import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
// import { UserContext } from "../App";

// const SideNav = () => {
//   let { userAuth } = useContext(UserContext);
//   const access_token = userAuth?.access_token ?? null;

//   // get current route
//   const location = useLocation();
//   const [showSideNav, setShowSideNav] = useState(false);
//   const [pageState, setPageState] = useState("");

//   const activeTabLine = useRef(null);

//   // update pageState when route changes
//   useEffect(() => {
//     const path = location.pathname.split("/")[2] || "";
//     setPageState(path.replace("-", " "));
//   }, [location.pathname]);

//   // move underline under active tab
//   useEffect(() => {
//     setShowSideNav(false);

//     const activeLink = document.querySelector(".sidebar-link.active");
//     if (activeLink && activeTabLine.current) {
//       const { offsetWidth, offsetLeft } = activeLink;
//       activeTabLine.current.style.width = `${offsetWidth}px`;
//       activeTabLine.current.style.left = `${offsetLeft}px`;
//     }
//   }, [pageState]);

//   return access_token === null ? (
//     <Navigate to="/signin" />
//   ) : (
//     <section className="relative flex gap-10 py-0 m-0 max-md:flex-col">
//       <div className="sticky top-[80px] z-30">
//         {/* Mobile nav */}
//         <div className="md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto relative">
//           <button
//             className="p-5 capitalize"
//             onClick={() => setShowSideNav((s) => !s)}
//           >
//             <i className="fi fi-rr-bars-staggered pointer-events-none"></i>
//           </button>

//           <button className="p-5 capitalize">{pageState}</button>

//           <hr
//             ref={activeTabLine}
//             className="absolute bottom-0 duration-500 h-[2px] bg-black"
//           />
//         </div>

//         {/* Sidebar */}
//         <div
//           className={
//             "min-w-[200px] h-[calc(100vh-80px-60px)] md:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 duration-500 " +
//             (!showSideNav
//               ? "max-md:opacity-0 max-md:pointer-events-none "
//               : "opacity-100 pointer-events-auto")
//           }
//         >
//           <h1 className="text-xl text-dark-grey mb-3">Dashboard</h1>
//           <hr className="border-black/40 -ml-6 mb-8 mr-6"></hr>

//           <NavLink to="/dashboard/blogs" className="sidebar-link">
//             <i className="fi fi-rr-document"></i> Blogs
//           </NavLink>

//           <NavLink to="/dashboard/notification" className="sidebar-link">
//             <i className="fi fi-rr-bell"></i> Notification
//           </NavLink>

//           <NavLink to="/editor" className="sidebar-link">
//             <i className="fi fi-rr-file-edit"></i> Write
//           </NavLink>

//           <h1 className="text-xl text-dark-grey mt-20 mb-3">Settings</h1>
//           <hr className="border-black/40 -ml-6 mb-8 mr-6"></hr>

//           <NavLink to="/settings/edit-profile" className="sidebar-link">
//             <i className="fi fi-rr-user"></i> Edit Profile
//           </NavLink>

//           <NavLink to="/settings/change-password" className="sidebar-link">
//             <i className="fi fi-rr-lock"></i> Change Password
//           </NavLink>
//         </div>
//       </div>

//       {/* Page contents */}
//       <div className="max-md:-mt-8 mt-5 w-full">
//         <Outlet />
//       </div>
//     </section>
//   );
// };

// export default SideNav;


import { useContext, useEffect, useRef, useState } from "react";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import { UserContext } from "../App";
import { useLocation } from "react-router-dom";

const SideNav = () => {

   let { userAuth: { access_token, isAdmin, new_notification_available}} = useContext(UserContext);
    
    let page = location.pathname.split("/")[2];
    let [ pageState, setPageState ] = useState(page.replace('-', ' '));

    let [ showSideNav, setShowSideNav ] = useState(false);

    let activeTabLine = useRef();
  
    let sideBarIconTab = useRef();
      let pageStateTab = useRef();

    const changePageState = (e) => {
        let {offsetWidth, offsetLeft} = e.target;

        activeTabLine.current.style.width = offsetWidth + "px";
        activeTabLine.current.style.left = offsetLeft + "px";

        if(e.target == sideBarIconTab.current){
            setShowSideNav(true);
        }else{
            setShowSideNav(false);
        }
    }
    useEffect(() => {
        setShowSideNav(false);

       if(pageStateTab.current)
       { pageStateTab.current.click();}
    }, [pageState]);



    return(
        access_token === null ? <Navigate to="/signin" /> :
        <>
        <section className="relative flex gap-10 py-0 m-0 max-md:flex-col">
            <div className="sticky top-[80px] z-30">

                <div className="md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto">

                    <button ref={sideBarIconTab} className="p-5 capitalize" onClick={changePageState}><i className="fi fi-rr-bars-staggered pointer-events-none" ></i></button>

                     <button ref={pageStateTab} className="p-5 capitalize" onClick={changePageState}>
                        { pageState }
                     </button>
                     <hr ref={activeTabLine} className="absolute bottom-0 duration-500" />

                </div>
                <div className={"min-w-[200px] h-[calc(100vh-80px-60px)] md:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 duration-500 " + (!showSideNav ? "max-md:opacity-0 max-md:pointer-events-none " : " opacity-100 pointer-events-auto")}>
                    <h1 className="text-xl text-dark-grey mb-3">Dashboard</h1>
                    <hr className="border-black/40 -ml-6 mb-8 mr-6"></hr>

                    <NavLink to="/dashboard/blogs" onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
                    <i className="fi fi-rr-document"></i>
                        Blogs
                        </NavLink>

                     <NavLink to="/dashboard/notifications" onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
                    <div className="relative">
                    <i className="fi fi-rr-bell"></i>
                    {
                        new_notification_available ? 
                         <span className="bg-red w-2 h-2 rounded-full absolute z-10 top-0 right-0"></span> : ""
                    }</div> 
                        Notifications
                        </NavLink>   

                    {
                        isAdmin ?  <NavLink to="/editor" onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
                    <i className="fi fi-rr-file-edit"></i>
                        Write
                        </NavLink> :""
                    }  

                      <h1 className="text-xl text-dark-grey mt-20 mb-3">Settings</h1>
                    <hr className="border-black/40 -ml-6 mb-8 mr-6"></hr>     

                      <NavLink to="/settings/edit-profile" onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
                    <i className="fi fi-rr-user"></i>
                        Edit Profile
                        </NavLink>   

                         <NavLink to="/settings/change-password" onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
                    <i className="fi fi-rr-lock"></i>
                        Change Password
                        </NavLink>    

                </div>

            </div>

             <div className="max-md:-mt-8 mt-5 w-full">

             <Outlet />
        </div>
        </section>
       
           
        </>
        
    )
}
export default SideNav;