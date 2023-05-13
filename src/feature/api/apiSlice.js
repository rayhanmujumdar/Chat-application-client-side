import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { userLoggedOut } from "../auth/authSlice";

// create a baseQuery
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: async (headers, { getState, endpoints }) => {
    const token = getState()?.auth?.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
// customize baseQuery implementing
const customBaseQuery = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401) {
    api.dispatch(userLoggedOut());
  }
  return result;
};

// root api slice
export const apiSlice = createApi({
  reducerPath: "api",
  keepUnusedDataFor: 600,
  baseQuery: customBaseQuery,
  tagTypes: [],
  endpoints: (builder) => ({}),
});
