import { createContext } from 'react';

export enum ORIENTATION {
    HORIZONTAL = 'horizontal',
    VERTICAL = 'vertical',
}

export const DragContext = createContext<{
    startIndex: number | null;
    setStartIndex: (value: number) => void;
    drop: (index: number | null) => void;
    onDrop: (start: number, end: number) => void;
    cancel: () => void;
    startGrab: (index: number) => void;
    isDragging: boolean;
    setIsDragging: (value: boolean) => void;
    setDragOver: (value: number) => void;
    i18n: {
        itemAriaLabelTemplate: string;
        dragHandleAriaLabel: string;
        grabbedAnnouncementTemplate: string;
        movedAnnouncementTemplate: string;
        droppedAnnouncementTemplate: string;
        cancelledAnnouncementTemplate: string;
        replacePlaceholders: (
            template: string,
            data: {
                position?: number;
                grabKey?: string;
                dropKey?: string;
                altDropKey?: string;
                cancelKey?: string;
                moveKeys?: string;
            },
        ) => string;
    };
} | null>(null);
