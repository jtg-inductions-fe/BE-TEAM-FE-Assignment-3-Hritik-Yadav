// have added this file to provide helper fucntions for handling
// the errors related to firebase and axios

import { AxiosError } from "axios";
import { FirebaseError } from "firebase/app";

import { ERROR_MESSAGE } from "@/services/service.const";

import type { resolveErrorTypes } from "./erroHandler.types";

export const resolveFirebaseError = (error: FirebaseError, defaultMessage: string): string => {
  let errorMessage = defaultMessage;
  if (error.code === "auth/network-request-failed") {
    errorMessage = "Network error: Check your internet connection.";
  } else if (error.code == "auth/invalid-credential") {
    errorMessage = "Invalid Email or Password. Try Again";
  }
  return errorMessage;
};

export const resolveAxiosError = (error: unknown, defaultMessage: string): string => {
  let errorMessage = defaultMessage;

  if (error instanceof AxiosError) {
    const status = error.response?.status;
    if (status && status >= 400 && status < 500) {
      errorMessage = error.response?.data?.message ?? defaultMessage;
    } else if (status && status >= 500) {
      errorMessage = "Server error. Please try again shortly.";
    } else if (!status && error.request) {
      errorMessage = "Network error: Check your internet connection.";
    } else if (error.message) {
      errorMessage = error.message;
    }
  }
  return errorMessage;
};

export const resolveError = ({
  error,
  FirebaseErrorMessage = "Firebase Error",
  AxiosErrorMessage = "Request Failed",
}: resolveErrorTypes): string => {
  let message = ERROR_MESSAGE;
  if (error instanceof FirebaseError) {
    message = resolveFirebaseError(error, FirebaseErrorMessage);
  } else if (error instanceof AxiosError) {
    message = resolveAxiosError(error, AxiosErrorMessage);
  }
  return message;
};
