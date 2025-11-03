import { useContext, useState } from "react";
import { UserContext } from "../App";
import toast from "react-hot-toast"; 
import { Toaster } from "react-hot-toast";
import { BlogContext } from "../pages/blog.page";
import axios from "axios";

const CommentField =({ action, index= undefined, replyingTo= undefined, setReplying }) => {

    let { blog, blog:{ _id, author: {_id: blog_author}, comments, comments:{ results: comment_arr }, activity, activity: {total_comments, total_parent_comments}}, setBlog, setTotalParentCommentsLoaded}= useContext(BlogContext);

    let { userAuth: { access_token, username, fullname,  profile_img }} = useContext(UserContext);   

const [ comment, setComment] = useState("");

const handleComment = () => {

    if(!access_token){
        return toast.error("Login to Leave a Comment!!");
    }
    if(!comment.length){
        return toast.error("Need to Write Something!!");
    }
   
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/add-comment",{
        _id, blog_author, comment, replying_to: replyingTo
    }, {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    })
    .then(({data}) => {
        
        setComment("");
        data.commented_by ={ personal_info: { username, profile_img, fullname}}

        let newCommentArr;

        if(replyingTo){
            comment_arr[index].children.push(data._id);
            data.childrenLevel = comment_arr[index].childrenLevel + 1;
            data.parentIndex = index;

            comment_arr[index].isReplyLoaded = true;

            comment_arr.splice(index + 1, 0, data);

            newCommentArr = comment_arr;

            setReplying(false);

        } else {
             data.childrenLevel = 0;

         newCommentArr = [ data, ...comment_arr ];

        }

       

        let parentCommentIncrementval = replyingTo ? 0 : 1;

        setBlog({ ...blog, comments: {...comments, results: newCommentArr}, activity: { ...activity, total_comments: total_comments + 1 , total_parent_comments: total_parent_comments + parentCommentIncrementval}})

        setTotalParentCommentsLoaded(preVal => preVal + parentCommentIncrementval)

    })
    .catch(err => {
        console.log(err);
    })

}

    return (
        <>
        <Toaster/>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Leave a Comment " className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"></textarea>
            <button className="btn-dark mt-5 px-10" onClick={handleComment}>{action}</button>
        </>
    )
}
export default CommentField;