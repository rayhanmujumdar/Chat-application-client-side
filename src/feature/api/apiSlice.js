import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

// root api slice
export const apiSlice = createApi({
  reducerPath: "api",
  keepUnusedDataFor: 600,
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: async (headers, { getState, endpoints }) => {
      const token = getState()?.auth?.accessToken;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [],
  endpoints: (builder) => ({}),
});
