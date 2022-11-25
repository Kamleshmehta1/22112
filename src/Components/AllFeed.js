import React from 'react'
import { useGetAllDataQuery } from "../features";
import Feed from './Feed';
import { useSelector } from 'react-redux';
import FindUsers from './FindUsers';
import Cookies from 'js-cookie';
import { useGetAllPostsQuery } from '../postFeature';
import { useFindUserQuery } from '../features';


function AllFeed() {
    const blogType = useSelector((state) => state.loginData.blogType);

    // const { data, isLoading } = useGetAllDataQuery();
    const { data: post, isLoading: isPostLoading } = useGetAllPostsQuery({
        user: `?rootUser=${Cookies.get("loginState")}`
    });
    const { data: user, isLoading } = useFindUserQuery(
        `?email=${Cookies.get("loginState")}`
    );

    if (isLoading || isPostLoading) {
        return <h1>Loading...</h1>
    }
    console.log(user);
    return (
        <div>
            {blogType === "ALL_BLOGS" && <FindUsers />}
            {blogType === "ALL_BLOGS" ?
                <div className="postContainer">
                    {<Feed posts={user[0].friendList} />}
                </div>
                : <Feed posts={post} />
            }
        </div>
    )
}

export default AllFeed