"use server";

import axios from "axios";
import { backendUrl } from "../constants/geenral";

export const signup = async (
  email: string,
  password: string,
  nin: string,
  first_name: string,
  last_name: string,
) => {
  try {
    await axios.post(`${backendUrl}/login`, {
      first_name,
      last_name,
      email,
      password,
      nin,
    });
  } catch (err: any) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const login = async (email: string, password: string) => {
  try {
    await axios.post(`${backendUrl}/login`, {
      email,
      password,
    });
  } catch (err: any) {
    throw new Error(err.response?.data?.message || err.message);
  }
};
