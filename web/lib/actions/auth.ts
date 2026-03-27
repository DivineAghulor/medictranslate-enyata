"use server";

import axios from "axios";
import { backendUrl } from "../constants/general";
import { normalizeAuthError } from "@/utils/auth";

export const signup = async (
  email: string,
  password: string,
  nin: string,
  first_name: string,
  last_name: string,
) => {
  try {
    if (!backendUrl) throw new Error("Backend URL is not configured.");

    await axios.post(`${backendUrl}/auth/signup`, {
      first_name,
      last_name,
      email,
      password,
      nin,
    });
  } catch (err: unknown) {
    throw new Error(normalizeAuthError(err));
  }
};

export const login = async (email: string, password: string) => {
  try {
    if (!backendUrl) throw new Error("Backend URL is not configured.");

    await axios.post(`${backendUrl}/auth/login`, {
      email,
      password,
    });
  } catch (err: unknown) {
    throw new Error(normalizeAuthError(err));
  }
};
