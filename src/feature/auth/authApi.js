import { apiSlice } from "../api/apiSlice";
import { userLoggedIn } from "./authSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // endpoints here
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem(
            "auth",
            JSON.stringify({
              accessToken: data.accessToken,
              user: data.user,
            })
          );
          dispatch(
            userLoggedIn({
              accessToken: data.accessToken,
              user: data.user,
            })
          );
        } catch (err) {
          // do nothing
        }
      },
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    async onQueryStarted(args, { queryFulfilled, dispatch }) {
      try {
        const { data } = await queryFulfilled;
        localStorage.setItem(
          "auth",
          JSON.stringify({
            accessToken: data.accessToken,
            user: data.user,
          })
        );
        dispatch(
          userLoggedIn({
            accessToken: data.accessToken,
            user: data.user,
          })
        );
      } catch (err) {
        // do nothing
      }
    },
  }),
});

export const { useRegisterMutation, useLoginMutation } = authApi;
