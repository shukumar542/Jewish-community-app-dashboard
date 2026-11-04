import { baseApi } from "./baseApi";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({ url: "/admin/profile", method: "GET" }), providesTags : ["Profile"],
    }),
    updateProfile: builder.mutation({
      query: ({ name, profileImage }) => {
        const formData = new FormData();
        if (name) formData.append("fullName", name);
        if (profileImage) formData.append("picture", profileImage);

        return {
          url: "/admin/profile",
          method: "PATCH",
          body: formData, 
        };
      },
      invalidatesTags: ["Profile"],
    }),
    changePassword: builder.mutation({
      query: (body) => ({
        url: "/user/change-password",
        method: "PATCH",
        body,
      }),
    }),
    getAllUsers: builder.query({
      query: ({ status, page, limit, search }) => {
        const params = { status, page, limit };
        if (search) params.search = search;
        return {
          url: "/admin/users",
          method: "GET",
          params,
        };
      },
      providesTags: ["Users"]
    }),
    updateUserStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/users/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Users"],
    }),
    // {{baseUrl}}/content
    getAboutUs: builder.query({
      query: () => `/website-content/about-us`,
      providesTags: ["aboutUs"],
    }),

    updateAboutUs: builder.mutation({
      query: (body) => ({
        url: "/website-content/about-us",
        method: "PATCH",
        body,
      }),
      invalidatesTags :["aboutUs"]
    }),
    // Privacy policy
    getPrivacy: builder.query({
      query: () => `/website-content/privacy-policy`,
      providesTags: ["privacy"],
    }),

    updatePrivacyPolicy: builder.mutation({
      query: (body) => ({
        url: "/website-content/privacy-policy",
        method: "PATCH",
        body,
      }),
      invalidatesTags :["privacy"]
    }),
    // Terms conditions
    getTerms: builder.query({
      query: () => `/website-content/terms-and-conditions`,
      providesTags: ["terms"],
    }),

    updateTerms: builder.mutation({
      query: (body) => ({
        url: "/website-content/terms-and-conditions",
        method: "PATCH",
        body,
      }),
      invalidatesTags :["terms"]
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
  useUpdateAboutUsMutation,
  useGetAboutUsQuery,
  useGetPrivacyQuery,
  useGetTermsQuery,
  useUpdatePrivacyPolicyMutation,
  useUpdateTermsMutation
} = profileApi;
