//import Editor from "../pages/editor.pages"
import AnimationWrapper from "../common/page-animation";
import logo from "../imgs/logo.png";
import defaultBanner from "../imgs/blog banner.png"
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import ImageKit from "imagekit-javascript";
import uploadImage from "../common/uploadImage";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";
import axios from "axios";
import { UserContext } from "../App";


const BlogEditor = () => {
    let { blog, blog: { title, banner, content, tags, des }, setBlog, textEditor, setTextEditor, setEditorState } = useContext(EditorContext);

    // let { userAuth: {access_token} } = useContext(UserContext);
    const userContext = useContext(UserContext);
    const access_token = userContext?.userAuth?.access_token;

    let { blog_id } = useParams();

    let navigate = useNavigate()

    //use effect

    useEffect(() => {
        const editor = new EditorJS({
            holder: "textEditor",
            data: Array.isArray(content) ? content[0] : content,
            tools: tools,
            placeholder: "WRITE SOMETHING!!!",
            onReady: () => {
                setTextEditor(editor);
            }
        });

        return () => {
            editor.isReady
                .then(() => editor.destroy())
                .catch((e) => console.warn("Editor cleanup failed", e));
        };
    }, []);

    const handleBannerUpload = (e) => {
        let img = e.target.files[0];
        if (img) {


            let loadingToast = toast.loading("uploading...")

            uploadImage(img).then((url) => {
                toast.dismiss(loadingToast);
                toast.success("uploaded sucessfully ✅");
                //blogBannerRef.current.src = url;

                setBlog({ ...blog, banner: url })
            });
        }
    };


    const handleTitleKeyDown = (e) => {
        console.log(e);
        if (e.keyCode == 13) {
            e.preventDefault();
        }
    }

    const handleTitleChange = (e) => {

        let input = e.target;

        input.style.height = 'auto'; // reset height first
        input.style.height = `${input.scrollHeight}px`;
        setBlog({ ...blog, title: input.value })

    }
    const handleError = (e) => {
        let img = e.target;

        img.src = defaultBanner;

    }

    const handlePublish = () => {
        if (!banner.length) {
            return toast.error("NEED TO UPLOAD BANNER TO PUBLISH BLOG")
        }
        if (!title.length) {
            return toast.error("WRITE TITLE TO PUBLISH!!")
        }
        if (textEditor.isReady) {
            textEditor.save().then(data => {
                if (data.blocks.length) {
                    setBlog({ ...blog, content: data });
                    setEditorState("publish")

                } else {
                    return toast.error("Write Something To Publish It")
                }
            })
                .catch((err) => {
                    console.log(err);
                })
        }

    }
    const handleSaveDraft = (e) => {
        const btn = e.target;

        if (btn.className.includes("disable")) return;

        if (!title.length) {
            return toast.error("Write title to save as draft");
        }



        let loadingToast = toast.loading("Saving Draft...");
        btn.classList.add("disable");

        if (textEditor.isReady) {
            textEditor.save().then(content => {
                let blogObj = {
                    title, banner, des, content, tags, draft: true
                };

                axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", {...blogObj, id: blog_id }, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                })
                    .then(() => {
                        toast.dismiss(loadingToast);
                        toast.success("Saved");

                        setTimeout(() => {
                            navigate("/dashboard/blogs?tab=draft");
                        }, 500);
                    })
                    .catch(({ response }) => {
                        toast.dismiss(loadingToast);
                        btn.classList.remove("disable"); // 💡 allow retry
                        toast.error(response?.data?.error || "Failed to publish");
                    });

            })
        }



    }

    return (
        <>
            <nav className="navbar">
                <Toaster position="top-center" reverseOrder={false} />

                <Link to="/" className="flex-none w-10">
                    <img src={logo} />
                </Link>
                <p className="max-md:hidden text-black line-clamp-1 w-full">
                    {title.length ? title : "NEW BLOG"}
                </p>

                <div className="flex gap-4 ml-auto">
                    <button className="btn-dark py-2"
                        onClick={handlePublish}>
                        publish
                    </button>
                    <button className="btn-light py-2" onClick={handleSaveDraft} >
                        Save Draft
                    </button>
                </div>
            </nav>

            <AnimationWrapper>
                <section>
                    <div className="mx- auto max-w-[900px] w-full">
                        <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
                            <label htmlFor="uploadBanner">
                                <img
                                    //ref ={blogBannerRef}
                                    src={banner}
                                    className="z-20"
                                    onError={handleError}
                                />
                                <input
                                    id="uploadBanner"
                                    type="file"
                                    accept=".png,.jpg,.jpeg,.pdf"
                                    hidden
                                    onChange={handleBannerUpload}
                                />
                            </label>

                        </div>
                        <textarea
                            defaultValue={title}
                            placeholder="Blog Title"
                            className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40 "
                            onKeyDown={handleTitleKeyDown}
                            onChange={handleTitleChange}
                        ></textarea>

                        <hr className="w-full opacity-10 my-5" />
                        <div id="textEditor" className="font-gelasio"></div>
                    </div>
                </section>
            </AnimationWrapper>

        </>
    )
}

export default BlogEditor;