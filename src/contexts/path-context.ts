import { createContext, useCallback, useState } from "react";
import { PathNameEnum } from "../enum/path-enum";

type PathContext = {
  to: PathNameEnum;
  linkTo: (pathName: PathNameEnum) => void;
};
export const Path = createContext<PathContext>({} as PathContext);

export const usePath = (): PathContext => {
  const [to, setTo] = useState(PathNameEnum.TIMELINE);

  const linkTo = useCallback(
    (pathName: PathNameEnum): void => {
      setTo(pathName);
    },
    [setTo]
  );

  return { to, linkTo };
};
