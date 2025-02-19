/** @format */

import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "../store/authSlice";

interface RootState {
  auth: {
    accessToken: string | null;
    refreshToken: string | null;
  };
}

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/api`,
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as RootState).auth.accessToken;
    const refreshToken = (getState() as RootState).auth.refreshToken;

    if (accessToken) {
      headers.set("authorization", `Bearer ${accessToken}`);
    }
    if (refreshToken) {
      headers.set("x-refresh-token", refreshToken);
    }
    return headers;
  },
  credentials: "include",
});

const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: { shout?: boolean }
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        api.dispatch(setCredentials(refreshResult.data));
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    }
  }
  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Transaction", "Budget"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    refreshToken: builder.mutation({
      query: (refreshToken) => ({
        url: "/auth/refresh",
        method: "POST",
        body: { refreshToken },
      }),
    }),

    logout: builder.mutation<{ message: string }, { refreshToken: string }>({
      query: (body) => ({
        url: "/auth/logout",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Transaction", "Budget"],
    }),

    createTransaction: builder.mutation({
      query: (transaction) => ({
        url: "/transaction/create",
        method: "POST",
        body: transaction,
      }),
      invalidatesTags: ["Transaction"],
    }),

    getTransactions: builder.query({
      query: (params) => ({
        url: "/transaction/all",
        params,
      }),
      providesTags: ["Transaction"],
    }),

    updateTransaction: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/transaction/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["Transaction"],
    }),

    deleteTransaction: builder.mutation({
      query: (id) => ({
        url: `/transaction/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Transaction"],
    }),

    createBudget: builder.mutation({
      query: (budget) => ({
        url: "/budget",
        method: "POST",
        body: budget,
      }),
      invalidatesTags: ["Budget"],
    }),

    getBudgets: builder.query({
      query: () => "/budget",
      providesTags: ["Budget"],
    }),

    updateBudget: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/budget/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["Budget"],
    }),

    deleteBudget: builder.mutation({
      query: (id) => ({
        url: `/budget/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Budget"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useCreateTransactionMutation,
  useGetTransactionsQuery,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
  useCreateBudgetMutation,
  useGetBudgetsQuery,
  useUpdateBudgetMutation,
  useDeleteBudgetMutation,
} = api;
