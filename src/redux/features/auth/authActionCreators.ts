import { privateAxios, publicAxios } from "../../../middleware/axiosInstance";
import { revertAll } from "../../globalActions";
import { AppDispatch } from "../../store"; // Assuming these types exist in your project
import { AxiosError } from "axios";
import { authSlice } from "./authSlice";
// Define types for form values and responses
interface FormValues {
  email: string;
  password: string;
}

interface ErrorResponse extends AxiosError {
  error?: {
    message: string;
  };
}

export function LoginUser(formValues: FormValues) {
  return async (dispatch: AppDispatch) => {
    // Update loading state
    dispatch(authSlice.actions.updateIsLoading({ isLoading: true }));

    try {
      // Make API call with the passed formValues
      const response = await publicAxios.post("/auth/login", {
        email: formValues.email,
        password: formValues.password,
      });

      console.log("vai", response);
      // Dispatch login action with tokens
      dispatch(
        authSlice.actions.login({
          isLoggedIn: true,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          userId: response.data.id,
        })
      );

      // Update loading state after successful login
      dispatch(authSlice.actions.updateIsLoading({ isLoading: false }));
      return true;
    } catch (error: any) {
      console.log(error);

      // Update error state
      dispatch(authSlice.actions.updateIsLoading({ isLoading: false }));
      return false;
    }
  };
}

export function LogoutUser() {
  return async (dispatch: AppDispatch) => {
    // Update loading state

    try {
      // Make API call
      await privateAxios.post("/auth/logout");

      // Reset state after logout
      dispatch(authSlice.actions.updateIsLoading({ isLoading: false }));
      dispatch(revertAll());
      // Update loading state after successful logout
    } catch (error: any) {
      dispatch(authSlice.actions.updateIsLoading({ isLoading: false }));
      const err = error as ErrorResponse;
      console.log(err);

      // Update error state
    }
  };
}
