import React, { useState } from 'react'
import { uploadFile } from './upload';

const DemoUp = () => {
    const[file,setFile] = useState(null);
    const handleUpload = async () =>{
        const url = await uploadFile(file)
        console.log(url);
        
    }
  return (
    
    <div>
      <input type="file" onChange={ e =>setFile(e.target.files[0] )}/>
      <button onClick={handleUpload}>Upload</button>
    </div>
  )
}

export default DemoUp

