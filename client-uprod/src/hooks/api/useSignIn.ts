
// import { useMutation } from "@tanstack/react-query";
// import axios from "axios";

// interface SignInPayload {
//   email: string;
//   password: string;
// }

// interface SignInResponse {
//   status: string;
//   message: string;
//   data: {
//     token: string;
//   };
// }

// const loginUser = async (payload: SignInPayload): Promise<SignInResponse> => {
//   const response = await axios.post("http://localhost:8000/api/v1/auth/signin", payload);
//   return response.data;
// };

// export const useSignIn = () => {
//   return useMutation(loginUser);
// };
