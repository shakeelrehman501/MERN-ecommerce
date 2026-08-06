import store from "@/redux/store";

export const getAuthConfig = () => {
  const token = store.getState().user.accessToken;

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};