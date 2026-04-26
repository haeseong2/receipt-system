export const login = async (data) => {

  const res = await fetch(
    "http://localhost:8080/api/login",
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