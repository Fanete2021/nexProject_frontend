import { FC } from "react";
import "./Loader.scss";
import { classNames } from "@/shared/lib/utils/classNames.ts";

export interface LoaderProps {
  className?: string;
}

const Loader: FC<LoaderProps> = ({ className }) => {
  return (
    <div className={classNames("lds-spinner",[ className ])}>
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
  );
};

export default Loader
