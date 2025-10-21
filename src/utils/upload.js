import { supabase } from "../config/supabase";

const uploadFile = async (file, bucketName = "images") => {
  //input cua no la 1 file
  //output la url
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.${fileExt}`;
  const path = fileName;
  const { error } = await supabase.storage.from(bucketName).upload(path, file);
  if (error) {
    console.log(error);
  }
  //public url
  const{data} = await supabase.storage.from(bucketName).getPublicUrl(path);
  return data.publicUrl

};
export { uploadFile };
