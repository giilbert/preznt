import { Button } from "@/components/ui/button";
import { NextPage } from "next";

const DesignPage: NextPage = () => {
  return (
    <div className="p-4">
      <div className="flex gap-2">
        <Button>Primary</Button>
        <Button color="secondary">Secondary</Button>
        <Button color="danger">Danger</Button>
        <Button color="confirm">Confirm</Button>
      </div>
      <div className="mt-4">
        <Button size="sm" className="mr-2">
          Small
        </Button>
        <Button size="md" className="mr-2">
          Medium
        </Button>
        <Button size="lg">Large</Button>
      </div>
    </div>
  );
};

export default DesignPage;
