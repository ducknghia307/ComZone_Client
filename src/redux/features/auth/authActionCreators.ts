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
      if (response.data.isMod === true) return "MOD";
      if (response.data.isAdmin === true) return "ADMIN";
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
  return async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      // Make API call
      await privateAxios.post("/auth/logout");

      // Reset state after logout
      dispatch(revertAll());
      dispatch(authSlice.actions.updateIsLoading({ isLoading: false }));

      return true; // Indicate success
    } catch (error: any) {
      dispatch(authSlice.actions.updateIsLoading({ isLoading: false }));

      console.error(error); // Log the error for debugging
      return false; // Indicate failure
    }
  };
}
