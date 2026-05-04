import axios from "axios";

export const login = async (data) => {

  const res = await fetch(
    "/api/login",
    {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      credentials:"include",
      body:JSON.stringify(data)
    }
  );

  return await res.json();
};