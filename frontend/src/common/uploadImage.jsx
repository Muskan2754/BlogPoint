import ImageKit from "imagekit-javascript";

const uploadImage = async (file) => {
  //console.log("⏳ Getting auth params...");

  // STEP 1: Check if auth data is coming correctly
  const authRes = await fetch("http://localhost:3000/api/imagekit/signature");
  const authParams = await authRes.json();

  //console.log("✅ Auth Params from server:", authParams);

  const imagekit = new ImageKit({
    publicKey: "public_AiDZy32J7VtC/4BWUx6MmILDwes=",
    urlEndpoint: "https://ik.imagekit.io/reactblog",
    authenticationEndpoint: "http://localhost:3000/api/imagekit/signature",
  });

  try {
    const result = await imagekit.upload({
      file,
      fileName: `blog-${Date.now()}.jpg`,

      // STEP 2: Pass auth params manually to make sure they work
      signature: authParams.signature,
      token: authParams.token,
      expire: authParams.expire,
    });

    console.log("✅ Upload success:", result);
    return result.url;
  } catch (err) {
    console.error("❌ Upload failed:", err);
    throw err;
  }
};

export default uploadImage;
