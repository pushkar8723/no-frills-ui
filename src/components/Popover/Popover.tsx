import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Card } from '../Card';

export enum POPOVER_POSITION {
    TOP_LEFT = 'TOP_LEFT',
    TOP_RIGHT = 'TOP_RIGHT',
    BOTTOM_LEFT = 'BOTTOM_LEFT',
    BOTTOM_RIGHT = 'BOTTOM_RIGHT',
}

interface Translate {
    x: number;
    y: number;
}

const positionMap = {
    [POPOVER_POSITION.TOP_LEFT]: `
        bottom: calc(100% - 10px);
        left: 0;
    `,
    [POPOVER_POSITION.TOP_RIGHT]: `
        bottom: calc(100% - 10px);
        right: 0;
    `,
    [POPOVER_POSITION.BOTTOM_RIGHT]: `
        top: calc(100% - 10px);
        right: 0;
    `,
    [POPOVER_POSITION.BOTTOM_LEFT]: `
        top: calc(100% - 10px);
        left: 0;
    `,
};

const PopoverDiv = styled.div`
    position: relative;
    display: inline-flex;
`;

const Popper = styled(Card)<{ position: POPOVER_POSITION; translateX: number; translateY: number }>`
    position: absolute;
    width: 100%;
    min-width: 200px;
    overflow: auto;
    animation: enter 0.3s linear;
    border-radius: 3px;
    z-index: 1;
    transform: translate(${(props) => props.translateX}px, ${(props) => props.translateY}px);
    ${(props) => positionMap[props.position]}

    &.closing {
        /* max-height: 0px;
        opacity: 0;
        overflow: hidden; */
        animation: exit 0.3s linear;
    }

    @keyframes enter {
        from {
            max-height: 0px;
            opacity: 1;
            overflow: hidden;
        }
        to {
            max-height: 300px;
            opacity: 1;
            overflow: hidden;
        }
    }

    @keyframes exit {
        to {
            max-height: 0px;
            opacity: 1;
            overflow: hidden;
        }
        from {
            max-height: 300px;
            opacity: 1;
            overflow: hidden;
        }
    }
`;

const KEY_CODES = {
    ESC: 27,
};

type PopoverProps = {
    /** Opens the popover */
    open: boolean;
    /** Anchor element for the popover */
    element: React.ElementType;
    /**
     * Position of the popover around anchor element
     * @default POPOVER_POSITION.BOTTOM_LEFT
     */
    position?: POPOVER_POSITION;
    /**
     * If the popover should close on `esc` key press
     * @default true
     */
    closeOnEsc?: boolean;
    /** Popover close callback */
    onClose?: () => void;
};

function PopoverComponent(
    props: React.PropsWithChildren<PopoverProps>,
    ref: React.Ref<HTMLDivElement>,
) {
    const {
        open: propsOpen,
        element,
        position = POPOVER_POSITION.BOTTOM_LEFT,
        closeOnEsc = true,
        onClose,
        children,
        ...rest
    } = props;

    const [open, setOpen] = useState<boolean>(propsOpen);
    const [closing, setClosing] = useState<boolean>(false);
    const [translate, setTranslate] = useState<Translate>({ x: 0, y: 0 });
    const popperRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(
        null,
    ) as React.MutableRefObject<HTMLDivElement | null>;
    const triggerRef = useRef<HTMLElement | null>(null);
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const focusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const popperId = useId();
    const triggerId = useId();

    const close = useCallback(() => {
        // Clear any existing timeouts first
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
        }
        if (focusTimeoutRef.current) {
            clearTimeout(focusTimeoutRef.current);
        }

        setClosing(true);
        closeTimeoutRef.current = setTimeout(() => {
            setOpen(false);
            setTranslate({ x: 0, y: 0 });

            if (onClose) {
                onClose();
            }
            setClosing(false);

            // Restore focus to the trigger element after animation completes
            focusTimeoutRef.current = setTimeout(() => {
                if (triggerRef.current && document.body.contains(triggerRef.current)) {
                    triggerRef.current.focus();
                }
                focusTimeoutRef.current = null;
            }, 50);
            closeTimeoutRef.current = null;
        }, 280);
    }, [onClose]);

    const keyupEventHandler = useCallback(
        (e: KeyboardEvent) => {
            if (closeOnEsc && e.keyCode === KEY_CODES.ESC) {
                close();
            }
        },
        [close, closeOnEsc],
    );

    const clickOutsideHandler = useCallback(
        (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                close();
            }
        },
        [close],
    );

    /**
     * Get called on popover mount.
     */
    useEffect(() => {
        document.addEventListener('keyup', keyupEventHandler);

        return () => {
            document.removeEventListener('keyup', keyupEventHandler);
        };
    }, [keyupEventHandler]);

    useEffect(() => {
        if (propsOpen) {
            setOpen(true);
            // Use requestAnimationFrame to add listener after current event loop
            const rafId = requestAnimationFrame(() => {
                document.addEventListener('click', clickOutsideHandler);
            });

            return () => {
                cancelAnimationFrame(rafId);
                document.removeEventListener('click', clickOutsideHandler);
            };
        } else {
            if (open) {
                close();
            }
        }
    }, [propsOpen, open, clickOutsideHandler, close]);

    useEffect(() => {
        if (open) {
            const {
                top = 0,
                left = 0,
                right = 0,
            } = popperRef.current?.getBoundingClientRect() ?? {};
            const height = popperRef.current?.scrollHeight ?? 0;
            const viewportWidth = document.documentElement.clientWidth;
            const viewportHeight = document.documentElement.clientHeight;
            const translation = { x: 0, y: 0 };

            if (position === POPOVER_POSITION.BOTTOM_LEFT) {
                // overflow can happen at bottom and right
                if (viewportHeight - top - height < 0) {
                    translation.y = -1 * (Math.abs(viewportHeight - top - height) + 5);
                }
                if (viewportWidth - right < 0) {
                    translation.x = -1 * (Math.abs(viewportWidth - right) + 5);
                }
            } else if (position == POPOVER_POSITION.BOTTOM_RIGHT) {
                // overflow can happen at bottom and left
                if (viewportHeight - top - height < 0) {
                    translation.y = -1 * (Math.abs(viewportHeight - top - height) + 5);
                }
                if (left < 0) {
                    translation.x = Math.abs(left) + 5;
                }
            } else if (position === POPOVER_POSITION.TOP_LEFT) {
                // overflow can happen at top and right
                if (top - height < 0) {
                    translation.y = Math.abs(top - height) + 5;
                }
                if (viewportWidth - right < 0) {
                    translation.x = -1 * (Math.abs(viewportWidth - right) + 5);
                }
            } else {
                // overflow can happen at top and left
                if (top - height < 0) {
                    translation.y = Math.abs(top - height) + 5;
                }
                if (left < 0) {
                    translation.x = Math.abs(left) + 5;
                }
            }
            // Note it can still overflow, but in that case fitting popper inside the
            // window is not possible.
            setTranslate(translation);
            popperRef.current?.focus();
        }
    }, [open, position]);

    /**
     * Cleanup timeouts on unmount
     */
    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
            if (focusTimeoutRef.current) {
                clearTimeout(focusTimeoutRef.current);
            }
        };
    }, []);

    const forwardRef = (node: HTMLDivElement | null) => {
        containerRef.current = node;

        if (typeof ref === 'function') {
            try {
                ref(node);
            } catch (error) {
                console.warn(error);
            }
        } else if (ref) {
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
    };

    return (
        <PopoverDiv ref={forwardRef} {...rest}>
            {React.createElement(element, {
                ref: triggerRef,
                id: triggerId,
                'aria-expanded': open,
                'aria-haspopup': 'dialog',
                'aria-controls': popperId,
            })}
            {open && (
                <Popper
                    elevated
                    tabIndex={0}
                    role="dialog"
                    aria-labelledby={triggerId}
                    id={popperId}
                    position={position}
                    translateX={translate.x}
                    translateY={translate.y}
                    className={closing ? 'closing' : ''}
                    ref={popperRef}
                    onClick={(e) => {
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                    }}
                >
                    {children}
                </Popper>
            )}
        </PopoverDiv>
    );
}

const Popover = React.forwardRef(PopoverComponent);
export default Popover;
