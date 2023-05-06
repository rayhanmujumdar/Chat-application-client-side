import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

// root api slice
export const apiSlice = createApi({
  reducerPath: "api",
  keepUnusedDataFor: 600,
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
  }),
  tagTypes: [],
  endpoints: (builder) => ({}),
});
