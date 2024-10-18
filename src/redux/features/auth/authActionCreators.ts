import { privateAxios, publicAxios } from "../../../middleware/axiosInstance";
import { revertAll } from "../../globalActions";
import { AppDispatch, RootState } from "../../store"; // Assuming these types exist in your project
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
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    // Update loading state
    dispatch(
      authSlice.actions.updateIsLoading({ isLoading: true, error: false })
    );

    try {
      // Make API call with the passed formValues
      const response = await publicAxios.post("/auth/login", {
        email: formValues.email,
        password: formValues.password,
      });

      console.log(response);
      // Dispatch login action with tokens
      dispatch(
        authSlice.actions.login({
          isLoggedIn: true,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        })
      );

      // Update loading state after successful login
      dispatch(
        authSlice.actions.updateIsLoading({ isLoading: false, error: false })
      );
    } catch (error: any) {
      console.log(error);

      // Update error state
      dispatch(
        authSlice.actions.updateIsLoading({ isLoading: false, error: true })
      );
    }
  };
}

// export function handleRefreshToken({
//   accessToken,
//   refreshToken,
// }: {
//   accessToken: string;
//   refreshToken: string;
// }) {
//   return async (dispatch: AppDispatch, getState: () => RootState) => {
//     dispatch(authSlice.actions.saveNewTokens({ accessToken, refreshToken }));
//   };
// }

export function LogoutUser() {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    // Update loading state
    dispatch(
      authSlice.actions.updateIsLoading({ isLoading: true, error: false })
    );

    try {
      // Make API call
      await privateAxios.post("/auth/logout");

      // Reset state after logout
      dispatch(revertAll());

      // Update loading state after successful logout
      dispatch(
        authSlice.actions.updateIsLoading({ isLoading: false, error: false })
      );
    } catch (error: any) {
      const err = error as ErrorResponse;
      console.log(err);

      // Update error state
      dispatch(
        authSlice.actions.updateIsLoading({ isLoading: false, error: true })
      );
    }
  };
}
// export function RegisterUser(formValues) {
//   return async (dispatch, getState) => {
//     dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

//     await axios
//       .post("/auth/signup", {
//         ...formValues,
//       })
//       .then(function (response) {
//         // dispatch(slice.actions.updateRegisterEmail({ email: response.data.metadata.user.usr_email }));
//         dispatch(
//           slice.actions.logIn({
//             isLoggedIn: true,
//             token: response.data.metadata.tokens.accessToken,
//             refreshToken: response.data.metadata.tokens.refreshToken,
//             user_id: response.data.metadata.user._id,
//             email: response.data.metadata.user.usr_email,
//             user: response.data.metadata.user,
//           })
//         );
//         dispatch(SetUser(response.data.metadata.user));
//         window.localStorage.setItem("user_id", response.data.metadata.user._id);
//         dispatch(
//           showSnackbar({ severity: "success", message: response.data.message })
//         );
//         dispatch(
//           slice.actions.updateIsLoading({ isLoading: false, error: false })
//         );
//       })
//       .catch(function (error) {
//         console.log(error);
//         dispatch(
//           showSnackbar({
//             severity: "error",
//             message: error.error?.message || "Try again later!",
//           })
//         );
//         dispatch(
//           slice.actions.updateIsLoading({ error: true, isLoading: false })
//         );
//       })
//       .finally(() => {
//         // if (!getState().auth.error) {
//         //     // window.location.href = '/auth/verify';
//         //     window.location.href = '/app';
//         // }
//       });
//   };
// }
