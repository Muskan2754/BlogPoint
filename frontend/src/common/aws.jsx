export const notuploadImage =(img) => {

    let imgUrl = null;
    
    axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/get-upload-url")
    .then(({data : { uploadURL}}) =>
    {
        axios({
            method :'PUT',
            url : uploadURL,
            headers:{'Content-Type' :'multipart/form-data'},
            data:img
        })
    })
    .then(()=>
    {
        console.log(uploadURL)
       // imgUrl : uploadURL.split("?")[0]
    })
}