"use server";

import axios from "axios";
import { backendUrl } from "../constants/general";

export const signup = async (
  email: string,
  password: string,
  nin: string,
  first_name: string,
  last_name: string,
) => {
  try {
    const res = await axios.post(`${backendUrl}/auth/signup`, {
      first_name,
      last_name,
      email,
      password,
      nin,
    });
    console.log(`Res.data:`, res.data);
  } catch (err: any) {
    console.error();
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const login = async (email: string, password: string) => {
  try {
    const res = await axios.post(`${backendUrl}/auth/login`, {
      email,
      password,
    });
    console.log(res.data);
  } catch (err: any) {
    throw new Error(err.response?.data?.message || err.message);
  }
};
