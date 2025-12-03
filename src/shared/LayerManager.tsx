import React, { ReactPortal, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from '@emotion/styled';

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
    component: JSX.Element;
    /** Position of the layer */
    position?: LAYER_POSITION;
    /** Delay for exit */
    exitDelay?: number;
    /** Close layer on `esc` key press. */
    closeOnEsc?: boolean;
    /** Close layer overlay is clicked. */
    closeOnOverlayClick?: boolean;
    /** Callback called when modal closes */
    closeCallback?: <T extends unknown>(resp: T) => void;
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
const POSITION_STYLE = {
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
    ${(props) => POSITION_STYLE[props.position]}
    ${(props) =>
        props.overlay &&
        `
        width: 100%;
        height: 100vh;
        background-color: var(--backdrop-color, #2681da80);
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
 */
class LayerManager {
    /** Layer stack */
    private layers: Layer[] = [];
    /** z-index of the next layer */
    private nextIndex = 10000;

    /**
     * Constructor simply registers a event listener on body to
     * react to esc key press.
     */
    constructor() {
        document.body.addEventListener('keyup', (e) => {
            if (this.layers.length && e.keyCode === KEY_CODES.ESC) {
                const lastLayer = this.layers.slice(-1)[0];
                if (lastLayer.config.closeOnEsc !== false) {
                    this.unmount(lastLayer);
                }
            }
        });
    }

    /**
     * Un-mounts a layer.
     *
     * It first adds a class 'nf-layer-exit' and then un-mounts the
     * layer after the `exitDelay` mentioned in the layer config.
     * This class will help component in triggering the entry animation.
     *
     * @param layer
     */
    private unmount = (layer: Layer, resp?: any) => {
        layer.element.setAttribute('class', 'nf-layer-exit');
        this.layers.splice(
            this.layers.findIndex((item) => item === layer),
            1,
        );

        setTimeout(() => {
            try {
                layer.config.closeCallback && layer.config.closeCallback(resp);
            } catch (e) {
                // Error in callback function. Ignore and proceed.
                console.warn(e.message);
            }
        }, layer.config.exitDelay);
    };

    /**
     * Renders a layer.
     * @param config
     */
    public renderLayer = (config: LayerConfig): [() => React.ReactPortal, (resp?: any) => void] => {
        // Merge default config with the provided config.
        const layerConfig = {
            ...defaultConfig,
            ...config,
        };

        // Get the z-index for the new layer
        const currentIndex = layerConfig.alwaysOnTop ? 2147483647 : this.nextIndex++;

        // Prepare the div on DOM where the new layer will be mounted.
        const divElement = document.createElement('div');
        divElement.setAttribute('id', `nf-layer-manager-${currentIndex}`);
        document.body.appendChild(divElement);

        // Add layer to stack.
        const currentLayer = {
            id: `nf-layer-manager-${currentIndex}`,
            config: layerConfig,
            element: divElement,
        };
        this.layers.push(currentLayer);

        const overlayClickHandler = (layer: Layer) => () => {
            layer.config.closeOnOverlayClick !== false && this.unmount(layer);
        };

        // Return callback which will trigger the un-mount.
        return [
            // Render the layer and then add `nf-layer-enter` class to
            // the div created above.
            // This class will help component in triggering the entry animation.
            function TestLayer(): ReactPortal {
                useEffect(() => {
                    // The delay is introduced to enable entry animation on Firefox.
                    // Somehow on Firefox, useEffect is triggered before the component
                    // is rendered it seems.
                    setTimeout(() => {
                        divElement.setAttribute('class', 'nf-layer-enter');
                    }, 10);

                    // Cleanup function
                    return () => {
                        document.body.removeChild(divElement);
                    };
                }, []);

                return ReactDOM.createPortal(
                    <Container
                        onClick={overlayClickHandler(currentLayer)}
                        zIndex={currentIndex}
                        {...layerConfig}
                    >
                        {layerConfig.component}
                    </Container>,
                    divElement,
                    // Used setTimeout so that the attribute is added only after
                    // the component is completely mounted.
                    // () => { setTimeout(() => divElement.setAttribute('class', 'nf-layer-enter'), 100) }
                );
            },
            (resp?: any) => {
                this.unmount(currentLayer, resp);
            },
        ];
    };
}

// Return the instance of the class to create a Singleton.
export default new LayerManager();
