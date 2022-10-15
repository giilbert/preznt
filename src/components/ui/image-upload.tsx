import clsx from "clsx";
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";

export const ImageUpload: React.FC<{
  aspectRatio: string;
  onChange: (file: File) => void;
  className?: string;
  name: string;
}> = ({ aspectRatio, onChange, className, name }) => {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>();
  const [file, setFile] = useState<File | null>();
  const [error, setError] = useState<string | null>();

  const onDrop = useCallback(
    async (files: File[]) => {
      const first = files[0];
      if (!first) return;

      // if the url already exists, delete it and then replace it
      if (imageDataUrl) URL.revokeObjectURL(imageDataUrl);
      const url = URL.createObjectURL(first);

      onChange(first);
      setImageDataUrl(url);
      setFile(first);
      setError(null);
    },
    [imageDataUrl, onChange]
  );

  const onRejection = useCallback((rejections: FileRejection[]) => {
    const first = rejections[0];
    if (!first) return;

    setError(first.errors[0]?.message || "An error occurred.");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    multiple: false,
    maxSize: 1024 * 1024 * 4, // 4 MB
    onDropAccepted: onDrop,
    onDropRejected: onRejection,
  });

  return (
    <div className="flex justify-center flex-col items-center">
      <div
        {...getRootProps()}
        className={clsx(
          "group w-full bg-neutral-900 hover:bg-neutral-850 transition-colors border border-neutral-600 cursor-pointer border-dashed flex justify-center items-center rounded",
          className
        )}
        style={{
          backgroundImage: `url("${imageDataUrl}")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          aspectRatio,
        }}
      >
        <input {...getInputProps()} name={name} />
        {isDragActive ? (
          <p className="text-neutral-400 bg-background-secondary opacity-90 px-2 py-1 rounded">
            Drop the files here ...
          </p>
        ) : (
          <p
            className={clsx(
              "z-10 group-hover:opacity-100 text-neutral-400 bg-background-secondary opacity-0 px-3 py-1 rounded transition-opacity",
              !imageDataUrl && "opacity-90"
            )}
          >
            Drag an image here, or click to select one
          </p>
        )}

        {file && (
          <p className="absolute bg-background-secondary rounded px-3 py-1 opacity-50">
            {file.name}
          </p>
        )}
      </div>

      {error && <p className="text-red-300 mt-2">Error: {error}</p>}
    </div>
  );
};
