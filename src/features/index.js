import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dataApi = createApi({
  reducerPath: "dataApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/userData" }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getAllData: builder.query({
      query: (path) => "/",
    }),
    findUser: builder.query({
      query: (user) => {
        console.log(user);
        return user
      },
      providesTags: ["User"]
    }),
    addSinglePost: builder.mutation({
      query(body) {
        return {
          url: "",
          method: "POST",
          body,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled, getState, getCacheEntry }) {
        try {
          let query;
          for (let key in getState().dataApi.queries) {
            if (getState().dataApi.queries[key].status === "fulfilled") {
              query = getState().dataApi.queries[key].originalArgs;
              console.log(query);
            }
            const { data: createdPost } = await queryFulfilled;
            dispatch(dataApi.util.updateQueryData("findUser", query, (drafts) => {
              console.log(JSON.stringify(drafts));
              drafts?.push(createdPost);
            }))
          }
        } catch (err) {
          console.log(err);
        }
      },
    }),
    addNewFriend: builder.mutation({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `${id}`,
          method: "PUT",
          body,
        };
      },
      async onQueryStarted(args, { queryFulfilled, dispatch, getState }) {
        try {
          let query;
          for (let key in getState().dataApi.queries) {
            if (getState().dataApi.queries[key].status === "fulfilled") {
              query = getState().dataApi.queries[key].originalArgs;
            }
            const { data: updatedPosts } = await queryFulfilled;
            dispatch(
              dataApi.util.updateQueryData("findUser", query, (draft) => {
                let Obj = draft.find((ele) => ele.email === args.email);
                Object.assign(Obj, updatedPosts);
              })
            );
          }
        } catch (err) {
          console.log(err);
        }
      },
    }),
  }),
});

export const { useGetAllDataQuery, useAddNewFriendMutation, useFindUserQuery, useAddSinglePostMutation } = dataApi;
