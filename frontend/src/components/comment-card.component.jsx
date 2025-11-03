import { useContext, useState } from "react";
import { getDay } from "../common/date";
import { UserContext } from "../App";
import toast from "react-hot-toast";
import CommentField from "./comment-field.component";
import { BlogContext } from "../pages/blog.page";
import axios from "axios";

const CommentCard = ({ index, leftVal, commentData}) => {

if (!commentData) return null;
    let { commented_by: { personal_info:{ profile_img, fullname, username: commented_by_username} },commentedAt, comment, _id, children } = commentData ;

    let { blog, blog: { comments, activity,activity : { total_parent_comments},comments: {results: comment_arr}, author: { personal_info:{username: blog_author} }}, setBlog, setTotalParentCommentsLoaded} = useContext(BlogContext)

    let{ userAuth: {access_token, username}} = useContext(UserContext);

    const [isReplying, setReplying] = useState(false);

    const getParentIndex = () => {
        let startingPoint = index - 1;
        try{
            while(comment_arr[startingPoint].childrenLevel >= commentData.childrenLevel){
                startingPoint--;
            }
        }catch {
            startingPoint = undefined;
        }
        return startingPoint;
    }

    const removeCommentsCard = (startingPoint, isDelete = false) => {
        if(comment_arr[startingPoint]){
            while( comment_arr[startingPoint].childrenLevel > commentData.childrenLevel ){
                comment_arr.splice(startingPoint, 1);

                if(!comment_arr[startingPoint]){
                    break;
                }
            }
        }
        if(isDelete){
            let parentIndex = getParentIndex();
            if(parentIndex !== undefined){
                comment_arr[parentIndex].children.filter(child => child !== _id) 
                if(!comment_arr[parentIndex].children.length){
                        comment_arr[parentIndex].isReplyLoaded = false;
                }
            }
            comment_arr.splice(index, 1);
        }
        if(commentData.childrenLevel == 0 && isDelete){
            setTotalParentCommentsLoaded( preVal => preVal - 1)
        }

        setBlog({...blog, comments: { results: comment_arr}, activity: {...activity, total_parent_comments: total_parent_comments - (commentData.childrenLevel == 0 && isDelete ? 1 : 0)}})
    }

    const loadReply = ({ skip = 0}) => {
        if(children.length){
            hideReply();

            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-replies",{ _id,skip})
            .then(({data: {replies}}) =>{
                commentData.isReplyLoaded = true;

                for( let i = 0; i < replies.length; i++){
                    replies[i].childrenLevel = commentData.childrenLevel + 1;

                    comment_arr.splice(index + 1 +i + skip,0, replies[i])
                }
                setBlog({ ...blog, comments: { ...comments, results: comment_arr }})
            })
            .catch(err => {
                console.log(err);
            })
        }
    }

    const deleteComment = (e) => {

        e.target.setAttribute("disabled", true);
        
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/delete-comment",{_id}, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        .then(() => {
            e.target.removeAttribute("disable");
            removeCommentsCard(index + 1, true);
        })
        .catch(err => {
            console.log(err);
        })
    }

    const hideReply = () => {
        commentData.isReplyLoaded = false;
        removeCommentsCard(index + 1)
    }

    const handleReply = ()=> {
        if(!access_token){
            return toast.error("login to leave a reply")
        }

        setReplying(preval => !preval);

    }

    return (
        <div className="w-full " style={{padding: `${leftVal * 10}px`}}>
            <div className="my-5 p-6 rounded-md border border-grey">
                <div className="flex gap-3 items-center mb-8">
                    <img src={profile_img} className="w-6 h-6 rounded-full"/>
                    <p className="line-clamp-1">{fullname}   @{commented_by_username}    </p><br/>
                    <p className="min-w-fit">{getDay(commentedAt)}</p>

                </div>
                            <p className="font-gelasio text-xl ml-3">{comment}</p>
                           <div className="flex gap-5 items-center mt-5" > 
                            {
                                commentData.isReplyLoaded ?
                                <button className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2" onClick={hideReply}>
                                    <i className="fi fi-rs-comment-dots"></i>Hide Reply
                                </button>
                                : 
                                 <button className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2" onClick={loadReply}>
                                    <i className="fi fi-rs-comment-dots"></i>{children.length} Reply
                                </button>
                            }
                            <button className="underline" onClick={handleReply}>Reply</button>
                            {
                                username == commented_by_username || username == blog_author ?
                                <button className="p-2 px-3 rounded-md border border-grey ml-auto hover:bg-red/30 hover:text-red flex items-center" onClick={deleteComment}>
                                <i className="fi fi-rr-trash pointer-events-none"></i>
                                </button> : ""
                            }
                           </div>
                           {
                            isReplying ?
                            <div className="mt-8">
                                <CommentField action="reply" index={index} replyingTo={_id} setReplying={setReplying}/>
                            </div>
                            : ""
                           }
            </div>

        </div>
    )
}
export default CommentCard;