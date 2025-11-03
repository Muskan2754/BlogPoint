import { Link } from "react-router-dom";
import { getFullDay } from "../common/date";
const AboutUser = ({ className, bio, social_links, joinedAt}) => {
    console.log(joinedAt);
    return (
        

        <div className={"md:w-[90%] md:mt-4 " + className}>
            <p className="text-m leading-4 ">{bio.length ? bio : "Nothing To Read"}</p>
            <div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-black">
                {
                    Object.keys(social_links).map((key) => {
                        let link = social_links[key];
                        return link ? <Link to={link} key={key} target="_blank" ><i className={"fi " + (key !== 'website' ? "fi-brands-" + key : "fi-rr-globe") + " text-3xl hover:text-red"}></i></Link> : " "  
                        
                       
                    })
                }
            </div>
            <p className="text-xl leading-7 " style={{ color: "#0008ffff" }}>{getFullDay(joinedAt)}</p>
        </div>
    )
}
export default AboutUser;