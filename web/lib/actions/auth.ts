"use server";

import axios from "axios";
import { backendUrl } from "../constants/general";
import { normalizeAuthError } from "@/utils/auth";

export type AuthActionResult =
  | { ok: true }
  | { ok: false; error: string };

export const signup = async (
  email: string,
  password: string,
  nin: string,
  first_name: string,
  last_name: string,
) : Promise<AuthActionResult> => {
  try {
    if (!backendUrl) {
      return { ok: false, error: "Backend URL is not configured." };
    }

    await axios.post(`${backendUrl}/auth/signup`, {
      first_name,
      last_name,
      email,
      password,
      nin,
    });

    return { ok: true };
  } catch (err: unknown) {
    return { ok: false, error: normalizeAuthError(err) };
  }
};

export const login = async (
  email: string,
  password: string,
): Promise<AuthActionResult> => {
  try {
    if (!backendUrl) {
      return { ok: false, error: "Backend URL is not configured." };
    }

    await axios.post(`${backendUrl}/auth/login`, {
      email,
      password,
    });

    return { ok: true };
  } catch (err: unknown) {
    return { ok: false, error: normalizeAuthError(err) };
  }
};
