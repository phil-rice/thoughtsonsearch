import {ReactElement, ReactNode} from "react";

export type DataLayoutProps = {
    layout: number[];  // Array specifying the number of items per row
    children: ReactNode;
    className?: string;
}
export type DataLayout = (props: DataLayoutProps) => ReactElement
