import React, { ReactPortal, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from '@emotion/styled';
import { getThemeValue, THEME_NAME } from './constants';

/** Enums for layer position on screen. */
export enum LAYER_POSITION {
    TOP_LEFT,
    TOP_CENTER,
    TOP_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_CENTER,
    BOTTOM_RIGHT,
    DIALOG,
}

interface LayerConfig {
    /** Show an overlay */
    overlay?: boolean;
    /** Element to render inside the layer. */
    component: JSX.Element | null;
    /** Position of the layer */
    position?: LAYER_POSITION;
    /** Delay for exit */
    exitDelay?: number;
    /** Close layer on `esc` key press. */
    closeOnEsc?: boolean;
    /** Close layer overlay is clicked. */
    closeOnOverlayClick?: boolean;
    /** Callback called when modal closes */
    closeCallback?: (resp?: unknown) => void;
    /** Layer is created with max z-index */
    alwaysOnTop?: boolean;
}

/** Default value of config */
const defaultConfig: LayerConfig = {
    closeOnEsc: true,
    overlay: false,
    position: LAYER_POSITION.TOP_LEFT,
    component: null,
    exitDelay: 0,
    closeOnOverlayClick: true,
    alwaysOnTop: false,
};

/** Metadata of each layer */
interface Layer {
    id: string;
    config: LayerConfig;
    element: HTMLDivElement;
}

/** Styles for each position */
const POSITION_STYLE: Record<LAYER_POSITION, string> = {
    [LAYER_POSITION.TOP_LEFT]: 'top: 0; left: 0;',
    [LAYER_POSITION.TOP_CENTER]: 'top: 0; left: 50%; justify-content: center;',
    [LAYER_POSITION.TOP_RIGHT]: 'top: 0; right: 0; justify-content: flex-end;',
    [LAYER_POSITION.BOTTOM_LEFT]: 'bottom: 0; left: 0;',
    [LAYER_POSITION.BOTTOM_CENTER]: 'bottom: 0; left: 50%; justify-content: center;',
    [LAYER_POSITION.BOTTOM_RIGHT]: 'bottom: 0; right: 0; justify-content: flex-end;',
    [LAYER_POSITION.DIALOG]: 'top: 0; left: 0; justify-content: center; align-items: center;',
};

/** Layer container component. */
const Container = styled.div<LayerConfig & { zIndex: number }>`
    position: fixed;
    display: flex;
    opacity: 0;
    transition: opacity 0.3s ease;
    ${(props) => POSITION_STYLE[props.position as LAYER_POSITION]}
    ${(props) =>
        props.overlay &&
        `
        width: 100%;
        height: 100vh;
        background-color: ${getThemeValue(THEME_NAME.BACKDROP_COLOR)};
        backdrop-filter: blur(0px);
        pointer-events: all;
    `}
    z-index: ${(props) => props.zIndex};

    .nf-layer-enter & {
        opacity: 1;
        ${(props) =>
            props.overlay &&
            `
            backdrop-filter: blur(3px);
        `}
    }
`;

/** Key code for different keys. */
const KEY_CODES = {
    ESC: 27,
};

/**
 * This is a shared helper class which manages the z-index of each layer.
 * If a component needs to be rendered in a different layer then this class
 * should be used. It internally maintains the stack of opened layer and each
 * `renderLayer` call will push a new layer in stack.
 *
 * This way we need not worry about the z-index and can freely keep on creating
 * new layers. The staring layer z-index is 10000. Leaving enough z-index for the
 * user if they desires so.
 *
 * @important Usage Pattern
 * To avoid creating duplicate layers (especially in React Strict Mode or Next.js),
 * always call `renderLayer` only once - either in a lifecycle method (like `componentDidUpdate`)
 * or in an imperative method (like `open()`).
 *
 * @example
 * // ❌ Don't call renderLayer in render() method
 * render() {
 *   if (this.state.show) {
 *     const [Component, closeFn] = LayerManager.renderLayer({ ... }); // Creates new layer on every render
 *     return <Component />;
 *   }
 * }
 *
 * @example
 * // ✅ Do call renderLayer once in a method and store the component
 * open() {
 *   const [Component, closeFn] = LayerManager.renderLayer({ ... });
 *   this.setState({ LayerComponent: Component });
 * }
 *
 * render() {
 *   const { LayerComponent } = this.state;
 *   return LayerComponent ? <LayerComponent /> : null;
 * }
 */
class LayerManager {
    /** Layer stack */
    private layers: Layer[] = [];
    /** z-index of the next layer */
    private nextIndex = 0;
    private keyupHandler!: (e: KeyboardEvent) => void;
    private timeoutIds = new Map<string, number>(); // Track timeouts

    /**
     * Constructor simply registers a event listener on body to
     * react to esc key press.
     */
    constructor() {
        if (typeof document !== 'undefined') {
            // Store handler reference for cleanup
            this.keyupHandler = (e) => {
                if (this.layers.length && e.keyCode === KEY_CODES.ESC) {
                    const lastLayer = this.layers.slice(-1)[0];
                    if (lastLayer.config.closeOnEsc !== false) {
                        this.unmount(lastLayer);
                    }
                }
            };
            document.body.addEventListener('keyup', this.keyupHandler);
        }
    }

    // Add cleanup method
    public destroy = () => {
        if (typeof document !== 'undefined' && this.keyupHandler) {
            document.body.removeEventListener('keyup', this.keyupHandler);
        }
        // Clear all pending timeouts
        this.timeoutIds.forEach((id) => clearTimeout(id));
        this.timeoutIds.clear();
        // Clean up remaining layers
        this.layers.forEach((layer) => {
            if (document.body.contains(layer.element)) {
                document.body.removeChild(layer.element);
            }
        });
        this.layers = [];
    };

    /**
     * Un-mounts a layer.
     *
     * It first adds a class 'nf-layer-exit' and then un-mounts the
     * layer after the `exitDelay` mentioned in the layer config.
     * This class will help component in triggering the entry animation.
     *
     * @param layer
     */
    private unmount = (layer: Layer, resp?: unknown) => {
        layer.element.setAttribute('class', 'nf-layer-exit');
        const index = this.layers.findIndex((item) => item === layer);
        if (index !== -1) {
            this.layers.splice(index, 1);
        }

        const timeoutId = window.setTimeout(() => {
            this.timeoutIds.delete(layer.id);
            try {
                layer.config.closeCallback?.(resp);
            } catch (err) {
                if (err instanceof Error) {
                    console.warn(err.message);
                } else {
                    console.warn(err);
                }
            }
            // Clear reference to help GC
            layer.config.component = null;
        }, layer.config.exitDelay);

        this.timeoutIds.set(layer.id, timeoutId);
    };

    /**
     * Renders a layer.
     * @param config
     */
    public renderLayer = (
        config: LayerConfig,
    ): [() => React.ReactPortal | null, (resp?: unknown) => void] => {
        // SSR guard
        if (typeof document === 'undefined') {
            return [() => null, () => {}];
        }

        // Merge default config with the provided config.
        const layerConfig = {
            ...defaultConfig,
            ...config,
        };

        // Get the z-index for the new layer
        const currentIndex = layerConfig.alwaysOnTop ? 2147483647 : 10000 + this.nextIndex;
        const className = layerConfig.alwaysOnTop ? 'nf-layer-manager-top' : 'nf-layer-manager';

        // Create a unique ID for tracking this layer
        const layerId = `${className}-${currentIndex + this.nextIndex}`;

        // Always increment for next layer
        this.nextIndex += 1;

        const overlayClickHandler = () => {
            const layer = this.layers.find((l) => l.id === layerId);
            if (layer && layer.config.closeOnOverlayClick !== false) {
                this.unmount(layer);
            }
        };

        const closeFn = (resp?: unknown) => {
            const layer = this.layers.find((l) => l.id === layerId);
            if (layer) {
                this.unmount(layer, resp);
            }
        };

        // Return callback which will trigger the un-mount.
        return [
            (): ReactPortal | null => {
                const [divElement, setDivElement] = React.useState<HTMLDivElement | null>(null);

                useEffect(() => {
                    // Create the div element only once when component mounts
                    const div = document.createElement('div');
                    div.setAttribute('class', className);
                    div.setAttribute('id', layerId);
                    document.body.appendChild(div);

                    // Add layer to stack
                    const currentLayer = {
                        id: layerId,
                        config: layerConfig,
                        element: div,
                    };
                    this.layers.push(currentLayer);

                    setDivElement(div);
                    // Add entry animation class after a short delay
                    setTimeout(() => {
                        div.setAttribute('class', 'nf-layer-enter');
                    }, 10);

                    // Track elements modified for accessibility
                    const modifiedElements: Array<{
                        element: Element;
                        hadAriaHidden: boolean;
                        previousValue: string | null;
                    }> = [];
                    let originalBodyOverflow: string | null = null;
                    let originalBodyPosition: string | null = null;
                    let originalBodyWidth: string | null = null;
                    let originalBodyTop: string | null = null;
                    let scrollY = 0;

                    // Apply aria-hidden to siblings and body scroll lock for overlay modals
                    if (layerConfig.overlay) {
                        // Hide all body children except this layer portal, scripts, and styles
                        const bodyChildren = Array.from(document.body.children);
                        bodyChildren.forEach((child) => {
                            if (
                                child !== div &&
                                child.className !== 'nf-layer-manager-top' &&
                                child.tagName !== 'SCRIPT' &&
                                child.tagName !== 'STYLE'
                            ) {
                                const hadAriaHidden = child.hasAttribute('aria-hidden');
                                const previousValue = child.getAttribute('aria-hidden');

                                // Only set aria-hidden if not already hidden
                                if (previousValue !== 'true') {
                                    child.setAttribute('aria-hidden', 'true');
                                    modifiedElements.push({
                                        element: child,
                                        hadAriaHidden,
                                        previousValue,
                                    });
                                }
                            }
                        });

                        // Prevent body scroll on iOS
                        scrollY = window.scrollY;
                        originalBodyOverflow = document.body.style.overflow;
                        originalBodyPosition = document.body.style.position;
                        originalBodyWidth = document.body.style.width;
                        originalBodyTop = document.body.style.top;

                        document.body.style.overflow = 'hidden';
                        document.body.style.position = 'fixed';
                        document.body.style.width = '100%';
                        document.body.style.top = `-${scrollY}px`;
                    }

                    // Cleanup function - remove div when component unmounts
                    return () => {
                        // Restore aria-hidden attributes
                        modifiedElements.forEach(({ element, hadAriaHidden, previousValue }) => {
                            if (document.body.contains(element)) {
                                if (hadAriaHidden && previousValue !== null) {
                                    element.setAttribute('aria-hidden', previousValue);
                                } else {
                                    element.removeAttribute('aria-hidden');
                                }
                            }
                        });

                        // Restore body scroll
                        if (layerConfig.overlay) {
                            document.body.style.overflow = originalBodyOverflow || '';
                            document.body.style.position = originalBodyPosition || '';
                            document.body.style.width = originalBodyWidth || '';
                            document.body.style.top = originalBodyTop || '';
                            window.scrollTo(0, scrollY);
                        }

                        if (document.body.contains(div)) {
                            document.body.removeChild(div);
                        }
                        // Remove from layers array
                        const index = this.layers.findIndex((layer) => layer.id === layerId);
                        if (index !== -1) {
                            this.layers.splice(index, 1);
                        }
                    };
                }, []); // Empty dependency array - run only once

                if (!divElement) {
                    return null;
                }

                return ReactDOM.createPortal(
                    <Container onClick={overlayClickHandler} zIndex={currentIndex} {...layerConfig}>
                        {layerConfig.component}
                    </Container>,
                    divElement,
                );
            },
            closeFn,
        ];
    };
}

// Return the instance of the class to create a Singleton.
export default new LayerManager();
