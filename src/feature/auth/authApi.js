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
          const {
            accessToken,
            user: { password, ...user },
          } = data;
          localStorage.setItem(
            "auth",
            JSON.stringify({
              accessToken: accessToken,
              user: user,
            })
          );
          dispatch(
            userLoggedIn({
              accessToken: accessToken,
              user,
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
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          const {
            accessToken,
            user: { password, ...user },
          } = data;
          accessToken;
          localStorage.setItem(
            "auth",
            JSON.stringify({
              accessToken: accessToken,
              user: user,
            })
          );
          dispatch(
            userLoggedIn({
              accessToken: accessToken,
              user,
            })
          );
        } catch (err) {
          // do nothing
        }
      },
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = authApi;
