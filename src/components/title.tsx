import { classNames } from "@/tools/css_tools";

interface TitleProps {
  children: React.ReactNode;
}

/**
 * Components used to show a info title on page.
 */
export function Title({ children }: TitleProps) {
  return (
    <>
      <p
        className={classNames(
          "mt-2 text-lg font-bold",
          "opacity-90 md:mt-4 md:text-xl",
        )}
      >
        {children}
      </p>
    </>
  );
}
