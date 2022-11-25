import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/userPosts" }),
  tagTypes: ["Posts"],
  endpoints: (builder) => ({
    getAllPosts: builder.query({
      query: ({ user }) => {
        // console.log(user);
        return user;
      },
    }),
    addSinglePost: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled, getState, getCacheEntry }) {
        try {
          let query;
          for (let key in getState().postApi.queries) {
            if (getState().postApi.queries[key].status === "fulfilled") {
              query = getState().postApi.queries[key].originalArgs;
              console.log(query);
            }
            const { data: createdPost } = await queryFulfilled;
            dispatch(postApi.util.updateQueryData("getAllPosts", query, (drafts) => {
              console.log(JSON.stringify(drafts));
              drafts?.push(createdPost);
            }))
          }
        } catch (err) {
          console.log(err);
        }
      },
    }),
    deletePost: builder.mutation({
      query(id) {
        return {
          url: `/${id}`,
          method: "DELETE",
        };
      },
      async onQueryStarted(args, { queryFulfilled, dispatch, getState }) {
        try {
          let query;
          for (let key in getState().postApi.queries) {
            if (getState().postApi.queries[key].status === "fulfilled") {
              query = getState().postApi.queries[key].originalArgs;
              console.log(query);
            }
            await queryFulfilled;
            dispatch(
              postApi.util.updateQueryData("getAllPosts", query, (draft) => {
                return draft.filter((ele) => ele?.id !== args)
              })
            );
          }
        } catch (err) {
          console.log(err);
        }
      },
    }),
    updatePost: builder.mutation({
      query(data) {
        const { id, ...body } = data;
        console.log(id);
        return {
          url: `/${id}`,
          method: "PUT",
          body,
        };
      },
      async onQueryStarted(args, { queryFulfilled, dispatch, getState }) {
        try {
          let query;
          for (let key in getState().postApi.queries) {
            if (getState().postApi.queries[key].status === "fulfilled") {
              query = getState().postApi.queries[key].originalArgs;
            }
            const { data: updatedPosts } = await queryFulfilled;
            console.log(args);
            dispatch(
              postApi.util.updateQueryData("getAllPosts", query, (draft) => {
                let Obj = draft.find((ele) => ele.id === args.id);
                Object.assign(Obj, updatedPosts);
              })
            );
          }
        } catch (err) {
          console.log(err);
        }
      },
    })
  }),
});

export const { useGetAllPostsQuery, useAddSinglePostMutation, useDeletePostMutation, useUpdatePostMutation } = postApi;