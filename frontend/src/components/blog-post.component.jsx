import { getDay } from "../common/date";
import {Link} from "react-router-dom";
const BlogPostcard =({content, author})  => {

    let {publishedAt,tags,title,des,banner, activity: { total_likes }, blog_id: id } = content;
    let { fullname,profile_img, username} = author;
   // console.log("Profile image URL:", profile_img);

    return (
        <Link to={`/blog/${id}`} className="flex gap-8 items-center border-b border-grey pb-5 mb-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl rounded-sm overflow-hidden backdrop-blur-md border-2 border-dark-grey">
        <div className="w-full">
            
            
            <div className="flex gap-2 items-center mb-7">
                <img src={profile_img} className="w-6 h-6 rounded-full"/>
                <p className="line-clamp-1">{fullname } @{username}</p>
                <p className="min-w-fit">{ getDay(publishedAt)}</p>
            </div>

            <h1 className="blog-title">{title}</h1>
            <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1110px]:hidden line-clamp-2"  >{des}</p>
            <div className="flex gap-4 mt-7">
                <span className="btn-light bg-[#000C7B] text-white text-sm py-1 px-4">{tags[0]}</span>
                <span className="ml-3 flex items-center gap-2 text-dark-grey">
                    <i className="fi fi-rr-heart text-red "></i>
                    {total_likes}</span>
            </div>
        </div>

        <div className="h-28 ascpect-square bg-[#000C7B]">
            <img src={banner} className="w-full h-full aspect-squrae object-cover"/>

        </div>
        </Link>
    )
    
}
export default BlogPostcard;