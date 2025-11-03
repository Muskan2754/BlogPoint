import pageNotFoundImage from "../imgs/404.png";
import { Link } from "react-router-dom";
import fullLogo from "../imgs/full-logo.png";

const PageNotFound = () => {
    return (
        <section className="h-cover relative p-10 flex flex-col gap-20 items-center text-center">
            <img src={pageNotFoundImage} className="select-none border-2 border-grey w-72 aspect-square object-cover rounded"></img>    
            <h1 className="text-xl font-gelasio leading-7">Page Not Found</h1>
            <p className="text-dark-grey text-xl leading-7 -mt-10">This Page Is Not Exists. Go Back To <Link to="/" className="text-black underline">Home Page</Link></p>
            <div className="mt-auto">
                <img src={fullLogo} className="h-8 object-contain block mx-auto select-none" />
                <p className="mt-5 text-dark-grey">Read Stories From All Over World</p>
            </div>
        </section>
    )
}
export default PageNotFound;