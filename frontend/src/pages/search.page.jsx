import { useParams } from "react-router-dom";
import InPageNavigation from "../components/inpage-navigation.component";
import Loader from "../components/loader.component";
import { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import BlogPostcard from "../components/blog-post.component";
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreButton from "../components/load-more.component";
import axios from "axios";
import UserCard from "../components/usercard.component";

const SearchPage = () => {
    let { query } = useParams()
      
    let [ users, setUsers ] = useState(null);
    let [ blogs, setBlog ] = useState(null);
    const searchBlogs = ({ page = 1, create_new_arr = false}) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { query, page})
      .then( async ({ data })=> { 
                  console.log(data.blogs);
                  let formatData = await filterPaginationData({
                      
                      state: blogs,
                      data: data.blogs,
                      page,
                      countRoute: "/search-blogs-count",
                      data_to_send:{ query},
                      create_new_arr
                  })
                  console.log(formatData);
                  setBlog(formatData);
              })
              .catch(err => {
                  console.log(err);
              });  
    };

    const fetchUsers = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users", { query })
        .then(( { data : { users }} ) => {
            setUsers(users);
        })
    }

    useEffect( () => {
         resetState(); 
         fetchUsers();           
        searchBlogs({page:1,  create_new_arr: true });

    }, [ query ])
    const resetState = () => {
        setBlog(null);
        setUsers(null);
    }

    const UserCardWrapper = () => {
        return (
            <>
                {
                    users == null ? <Loader /> :
                    users.length ?
                    users.map((user, i) => {
                        return <AnimationWrapper key={i} transition={{ duration: 1, delay: i*0.08}}>
                            <UserCard user={user}/>
                        </AnimationWrapper>
                    })
                    : <NoDataMessage message="No User Found"/>

                }
            </>
        )
    }

    return (
        <section className="h-cover flex justify-center gap-2">
            <div className="w-full">
                <InPageNavigation routes={[`Search Results for "${query}"`, "Account Matched"]} defaultHidden={["Account Matched"]}>
                    <>
                        {
                             blogs == null ? (<Loader />) :
                               (blogs.results.length ? 
                                blogs.results.map((blog,i) => {
                                    return ( <AnimationWrapper transition={ {duration: 1, delay: i*1 }}>
                                        <BlogPostcard content={blog} author={blog.author.personal_info}/>
                                    </AnimationWrapper> )
                                }) : <NoDataMessage message="No Blog Found!!"/>
                            )}
                            <LoadMoreButton state={blogs} fetchDataFun={searchBlogs}/>
                        
                    </>
                    <UserCardWrapper />
                </InPageNavigation>
            </div>
            <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
                <h1 className="font-medium text-xl mb-8" > <i className="fi fi-rr-circle-user mt-1" ></i> Search result for User</h1>
                <UserCardWrapper />
            </div>
        </section>
    
    )

}
export default SearchPage;