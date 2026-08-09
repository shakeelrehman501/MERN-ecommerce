import axios from "axios";
import { BASE_URL } from "@/lib/constants.js";

export const refreshAccessToken = async () => {
  const { data } = await axios.post(
    `${BASE_URL}/refresh-token`,
    {},
    {
      withCredentials: true,
    },
  );
  console.log(data);

  return data;
};
