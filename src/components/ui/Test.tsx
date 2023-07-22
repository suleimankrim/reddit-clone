import Blocks from "editorjs-blocks-react-renderer";
import { FC } from "react";
import dynamic from "next/dynamic";

interface TestProps {
  content: any;
}

const Test: FC<TestProps> = ({ content }: TestProps) => {
  return (
    <Blocks
      data={content}
      config={{
        image: {
          className: "h-80 w-full",
          actionsClassNames: {
            stretched: "object-contain",
            withBorder: "border border-2",
            withBackground: "p-2",
          },
        },
      }}
    />
  );
};
export default dynamic(() => Promise.resolve(Test), { ssr: false }) ?? (
  <div></div>
);
