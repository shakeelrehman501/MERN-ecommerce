import axios from "axios";
import { BASE_URL } from "@/lib/constants";

export const refreshAccessToken = async () => {
  const { data } = await axios.post(
    `${BASE_URL}/api/v1/user/refresh-token`,
    {},
    {
      withCredentials: true,
    },
  );

  return data;
};