import { useContext } from "react";
import AnimationWrapper from "../common/page-animation";
import { Toaster,toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import Tag from "./tags.component";
import axios from "axios";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
const PublishForm = () => {

    let characterLimit = 200;
    let tagLimit = 10;

    let {blog, blog:{banner,title,des,tags,content},setEditorState,setBlog} = useContext(EditorContext);
    let { blog_id } = useParams();
    let { userAuth: {access_token} } =useContext(UserContext);
    let navigate = useNavigate();

    const handleCloseEvent = () => {
        setEditorState("editor")
    }

    const handleBlogTitleChange = (e) =>
    {
        let input = e.target;
        setBlog({...blog,title:input.value})
    }

    const handleBlogDesChange = (e) => {
        let input = e.target;

        setBlog({...blog,des: input.value})
    }

    const handleTitleKeyDown = (e) =>
    {
        if (e.keyCode == 13){
            e.preventDefault();
        }
    }

    const handleKeyDown = (e) => {
        if(e.keyCode == 13 || e.keyCode == 188 ){
            e.preventDefault();

            let tag =e.target.value;

            if(tags.length < tagLimit )
            {
                if(!tags.includes(tag) && tag.length) {
                    setBlog({...blog, tags:[...tags, tag]})
                }
         
            }else{
                toast.error(`Maximum Tag Limit is ${tagLimit}`)
            }
            e.target.value= "";
        }
    }
    const publishBlog = (e) => {
    const btn = e.target;

    if (btn.className.includes("disable")) return;

    if (!title.length) {
        return toast.error("Write title to publish");
    }

    if (!des.length || des.length > characterLimit) {
        return toast.error(`Write description to publish within ${characterLimit} limit`);
    }

    if (!tags.length) {
        return toast.error("At least one tag is required for ranking");
    }

    let loadingToast = toast.loading("Publishing...");
    btn.classList.add("disable");

    let blogObj = {
        title, banner, des, content, tags, draft: false
    };

    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", {...blogObj, id: blog_id}, {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    })
    .then(() => {
        toast.dismiss(loadingToast);
        toast.success("Published");

        setTimeout(() => {
            navigate("/dashboard/blogs");
        }, 500);
    })
    .catch(({ response }) => {
        toast.dismiss(loadingToast);
        btn.classList.remove("disable"); // 💡 allow retry
        toast.error(response?.data?.error || "Failed to publish");
    });
};


    return (
        <AnimationWrapper>
            <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-6 lg:gap-4">
                <Toaster/>
                <button className="w-20 h-20 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
                onClick={handleCloseEvent}>
                    <i className="fi fi-rr-circle-xmark"></i>
                </button>

                <div className="max-w-[550] center">
                    <p className="text-dark-grey mb-1">Preview</p>
                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
                        <img src={banner}/>
                    </div>
                    <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">{title}</h1>
                    <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">{des}</p>
                </div>
                <div className="border-grey  lg:border-1 lg:pl-8">

                    <p className="text-dark-grey mb-2 mt-9">Blog Title</p>

                    <input type="text" placeholder="Blog Title" defaultValue={title} className="input-box pl-4"
                    onChange={handleBlogTitleChange}/>

                      <p className="text-dark-grey mb-2 mt-9">Short Description</p>

                      <textarea maxLength={characterLimit}
                      defaultValue={des}
                      className="h-40 resize-none leading-7 input-box pl-4"
                      onChange={handleBlogDesChange}
                      onKeyDown={handleTitleKeyDown}>
                      </textarea>

                      <p className="mt-1 text-dark-grey text-sm text-right">{characterLimit - des.length} character left</p>

                     <p className="text-dark-grey mb-2 mt-9">Topics - ( Help in searching and ranking your blog post ) </p>

                     <div className="relative input-box pl-1 py-2 pb-4">
                        <input type="text" placeholder="Topic" className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
                        onKeyDown={handleKeyDown}/>
                        

                    {
                        tags.map ((tag,i) => {
                            return <Tag tag={tag} tagIndex={i} key={i}/>
                    })}
                        
                     </div>

                    <p className="mt-1 mb-4 text-dark-grey text-right">{ tagLimit - tags.length} Tags Left</p>
                    <button className="btn-dark px-8" onClick={publishBlog} >Publish</button>

                </div>
            </section>
        </AnimationWrapper>
    )
}

export default PublishForm;