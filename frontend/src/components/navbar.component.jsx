import { useContext, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from "../imgs/logo.png";
import { UserContext } from "../App";
import UserNavigationPanel from "./user-navigation.component";
import { useEffect } from "react";
import axios from "axios";



const Navbar = () => {
    const [searchBoxVisibility, setSearchVisibility] = useState(false)
    const [userNavPanel, setUserNavPanel] = useState(false);



    const { userAuth, userAuth: { access_token, profile_img, new_notification_available, isAdmin }, setUserAuth } = useContext(UserContext);

    useEffect(() => {
        if (access_token) {
            axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/new-notification", {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
                .then(({ data }) => {
                    setUserAuth({ ...userAuth, ...data })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [access_token])

    let navigate = useNavigate();

    const handleSearch = (e) => {
        let query = e.target.value;
        console.log(e);
        if (e.keyCode == 13 && query.length) {
            navigate(`/search/${query}`)
        }
    }

    const handleUserNavPanel = () => {
        setUserNavPanel(currentVal => !currentVal);
    }

    const handleBlur = () => {
        setTimeout(() => {
            setUserNavPanel(false);

        }, 200);
    }

    return (
        <>
            <nav className="navbar z-50">
                <Link to="/" className="flex-none w-10">
                    <img src={logo} className="w-full" />
                </Link>


                <div className={"absolute bg-white w-full left-0 top-full mt-0 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:w-auto  md:show " + (searchBoxVisibility ? "show" : "hide")}>
                    <input
                        type="text"
                        placeholder="search"
                        className="w-full md:w-auto bg-[#CCE6EA] p-4 pl-6 pr-[12%] md:pr-6 rounded-full 
                placeholder:text-dark-grey md:pl-12 "
                        onKeyDown={handleSearch}
                    />
                    <i className="fi fi-rr-search absolute right-[10%] 
                md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 
                text-x1 text-dark-grey"></i>
                </div>

                <div className="flex items-center gap-3 md:gap-6 ml-auto">
                    <button className="md:hidden bg-grey w-12 h-12 rounded-full 
                flex items-center justify-center "
                        onClick={() => setSearchVisibility(currentVal => !currentVal)
                        }>
                        <i className="fi fi-rr-search text-xl text-[#000C7B]"></i>
                    </button>
{                    
                    <Link to="/editor" className="hidden md:flex gap-2 link">
                        <i className="fi fi-rr-file-edit"></i>
                        <p>
                            write
                        </p>
                    </Link> }
                    {
                        access_token ?
                            <>
                                <Link to="/dashboard/notifications">
                                    <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10">
                                        <i className="fi fi-rr-bell text-2xl text-red block mt-1"></i>

                                        {
                                            new_notification_available ? 
                                             <span className="bg-red w-3 h-3 rounded-full absolute z-10 top-2 right-2"></span> : ""

                                        }

                                     
                                    </button>
                                </Link>

                                <div className="relative" onClick={handleUserNavPanel} onBlur={handleBlur}>
                                    <button className="w-12 h-12 mt-1">
                                        <img src={profile_img} className="w-full h-full object-cover rounded-full" />
                                    </button>
                                    {
                                        userNavPanel ? <UserNavigationPanel />
                                            : ""
                                    }



                                </div>



                            </>
                            :
                            <>
                                <Link className="btn-dark py-2 bg-[#000C7B]"  to="/signin">
                                    Sign In
                                </Link>

                                <Link className="btn-light py-2  hidden md:block bg-[#000C7B]" style={{ color: "white"}} to="/signup">
                                    Sign Up
                                </Link>
                            </>
                    }


                </div>



            </nav>

            <Outlet />
        </>
    )
}
export default Navbar;