import { createContext } from "react";

export enum ORIENTATION {
    HORIZONTAL='horizontal',
    VERTICAL='vertical',
}

export const DragContext = createContext<{
    startIndex: number;
    setStartIndex: (value: number) => void;
    drop: (index: number) => void;
    isDragging: boolean;
    setIsDragging: (value: boolean) => void;
    setDragOver: (value: number) => void;
}>(null);
