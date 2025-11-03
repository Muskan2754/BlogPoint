import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import { useEffect } from "react";
import { useState } from "react";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import Loader from "../components/loader.component"
import BlogPostcard from "../components/blog-post.component"
import { activeTabRef } from "../components/inpage-navigation.component";
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreButton from "../components/load-more.component";
import { Link } from "react-router-dom";
const HomePage = () => {

    let [ blogs, setBlog ] =useState(null);


    let [ trendingBlogs, setTrendingBlog ] =useState(null);
    let [pageState,setPageState] = useState("home");
    let categories = ["test","programming","film making","technology","travel","cooking","food","fitness","finance"]

    const fetchLatestBlogs = ({page = 1}) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", { page } )
        .then( async ({ data })=> { 
            console.log(data.blogs);
            let formatData = await filterPaginationData({
                
                state: blogs,
                data: data.blogs,
                page,
                countRoute: "/all-latest-blogs-count",
                create_new_arr: page === 1
            })
            console.log(formatData);
            setBlog(formatData);
        })
        .catch(err => {
            console.log(err);
        });
    };

    const fetchBlogByCategory = ({page = 1}) => {
         axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { tag: pageState, page} )
        .then(async ({data})=> { 
         let formatData = await filterPaginationData({
                
                state: blogs,
                data: data.blogs,
                page,
                countRoute: "/search-blogs-count",
                data_to_send: {tag: pageState},
                create_new_arr: page === 1
            })
            
            setBlog(formatData);
        
        })
        .catch(err => {
            console.log(err);
        })

    }

     const fetchTrendingBlogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs" )
        .then(({data})=> { 
            setTrendingBlog(data.blogs);
        })
        .catch(err => {
            console.log(err);
        })
    }

    const loadBlogByCategory = (e) => {

        let category = e.target.innerText.toLowerCase();
        setBlog(null);
        if(pageState == category){
            setPageState("home");
            return;
        }
        setPageState(category);
   
    }
    useEffect(() => {
        activeTabRef.current.click();
        if(pageState == "home"){
            fetchLatestBlogs({page: 1});
        }else {
            fetchBlogByCategory({page: 1})
        }
        if (!trendingBlogs){
        fetchTrendingBlogs();
    }
    }, [pageState])

    return (
       <AnimationWrapper>
  <div className="min-h-screen bg-gradient-to-br from-[#DFF0FD] via-[#c2e9fb] to-[#FFE0F9] flex flex-col">
    
    {/* Animated banner 
    <div className="w-full text-center h-60 flex flex-col justify-center items-center  bg-gradient-to-l from-pink-100 via-purple-100 to-indigo-100  overflow-hidden">
     <img 
        src="/assets/banner.gif" 
        //alt="Animated Banner"
        className="absolute inset-0 w-full h-full object-cover opacity-30 animate-pulse"
      /> 
      <h1 className="text-4xl font-extrabold z-10 text-[#000C7B] hover:text-[#EF88BE]">Welcome to BlogHub ✨</h1>
      <p className="text-lg text-[#EF88BE] hover:text-[#000C7B] z-10">Explore stories, travel hacks, and tech trends</p>
    </div> */}
    
    <div className="w-full bg-gradient-to-l from-[#e0f2fe] via-[#ede9fe] to-[#fce7f3] dark:from-[#1e1b4b] dark:via-[#312e81] dark:to-[#831843] py-16 text-center transition-colors duration-500">
  <h1 className="text-5xl font-extrabold text-[#000C7B] hover:text-[#EF88BE] dark:text-[#c7d2fe] font-gelasio">
    Welcome to BlogPoint ✨
  </h1>
  <p className="text-lg text-[#EF88BE] hover:text-[#000C7B] dark:text-[#cbd5e1] mt-3">
    Explore stories, travel hacks, and tech trends
  </p>
</div>


    <section className="h-cover items-start flex justify-center gap-10 p-10">

                { /* latest blogs */}
                <div className="w-full">
                    <InPageNavigation routes={[pageState ,"trending blogs", ]} defaultHidden={["trending blogs"]}>

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
                            <LoadMoreButton state={blogs} fetchDataFun={(pageState == "home" ? fetchLatestBlogs : fetchBlogByCategory)}/>
                        </>
                        {
                            
                                trendingBlogs == null ? (<Loader />) :
                               ( trendingBlogs.length ? 
                                trendingBlogs.map((blog,i) => {
                                    return (<AnimationWrapper transition={{duration: 1, delay: i*1 }}>
                                        <MinimalBlogPost blog={blog} index={i}/>
                                    </AnimationWrapper>)
                                })
                                : <NoDataMessage message="No Blog Found!!"/>  

                        )}

                    </InPageNavigation>
                </div>

                {/* */}
                <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l bg-white border-grey pl-8 pt-3 max-md:hidden ">
                    <div className="flex flex-col gap-10">
                        <div>
                            <h1 className="font-medium text-xl mb-8">Stories from all Interests</h1>
                        <div className="flex gap-3 flex-wrap">
                            {
                                categories.map((category,i) =>{
                                    return <button onClick={loadBlogByCategory} className={"tag " + (pageState == category ? " bg-black text-white" : " ")} key={i}>{category}</button>
                                })
                            }

                        </div>
                        </div>
                  
                    <div>
                        <h1 className="font-medium text-xl mb-8">Trending <i className="fi fi-rr-chart-line-up"></i></h1>
                        {
                             
                                trendingBlogs == null ? <Loader /> :
                                trendingBlogs.length ?
                                trendingBlogs.map((blog,i) => {
                                    return <AnimationWrapper transition={{duration: 1, delay: i*1 }}>
                                        <MinimalBlogPost blog={blog} index={i}/>
                                    </AnimationWrapper>
                                })
                                :<NoDataMessage message="No Blog Found!!"/>

                        }
                    </div>
                   </div>     
                </div>
            </section>

        <footer className="bg-gradient-to-r from-[#fdfbfb] to-[#ebedee] dark:from-[#111827] dark:to-[#1f2937] text-gray-700 dark:text-gray-300 py-10 mt-10">
  <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
    
    {/* --- Left: Logo / About --- */}
    <div>
      <h2 className="text-2xl font-bold text-[#1e3a8a] dark:text-[#93c5fd] mb-3">BlogPoint ✨</h2>
      <p className="text-sm leading-relaxed">
        Explore inspiring stories, travel tips, and tech trends — all in one hub.
      </p>
    </div>

    {/* --- Center: Links --- */}
    <div>
      <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
      <ul className="space-y-2 underline text-sm">
        <li><a href="#" className="hover:text-[#8B46FF] underline transition">Home</a></li>
        <li><a href="#" className="hover:text-[#8B46FF] underline transition">Categories</a></li>
        <li><Link to="/dashboard/profile" className="hover:text-[#8B46FF] transition">Dashboard</Link></li>
        <li><Link to="/editor" className="hover:text-[#8B46FF] transition">Write Blog</Link></li>
      </ul>
    </div>

    {/* --- Right: Social Media --- */}
    <div>
      <h3 className="text-lg font-semibold mb-3">Connect with us</h3>
      <div className="flex space-x-4 ">
        <Link to={`https://twitter.com/intent/tweet?text=Read `}>
                                    <i className="fi fi-brands-twitter text-xl hover:text-twitter" ></i>

                </Link>
        <Link to={`https://instagram.com/ `}>
                                    <i className="fi fi-brands-instagram text-xl hover:text-red" ></i>

                </Link>
       <Link to={`https://youtube.com/ `}>
                                    <i className="fi fi-brands-youtube text-xl hover:text-red" ></i>

                </Link>
      </div>
    </div>
  </div>

  {/* --- Bottom Copyright --- */}
  <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8 border-t border-gray-200 dark:border-gray-700 pt-4">
    © 2025 BlogPoint. All rights reserved. | Built with 💙 by Muskan
  </div>
</footer>


            </div>
       </AnimationWrapper>
    )

}
export default HomePage;