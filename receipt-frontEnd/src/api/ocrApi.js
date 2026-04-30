import api from "./commonApi";

export const uploadReceipt = async(file)=>{

  const formData = new FormData();
  formData.append("file",file);
  const res = await api.post("/upload",formData,{
      headers:{
        "Content-Type":
          "multipart/form-data"
      }
    }
  );

  return res.data;
};