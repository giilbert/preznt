export const fileToBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () =>
      resolve(
        (reader.result as string).replace("data:", "").replace(/^.+,/, "")
      );
    reader.onerror = (error) => reject(error);
  });
};
