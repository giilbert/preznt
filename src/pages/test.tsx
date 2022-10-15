import { ImageUpload } from "@/components/ui/image-upload";
import { NextPage } from "next";

const TestPage: NextPage = () => {
  return (
    <div>
      <ImageUpload aspectRatio="4 / 1" />
    </div>
  );
};

export default TestPage;
