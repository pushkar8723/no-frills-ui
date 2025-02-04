import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import LayerManager, { LAYER_POSITION } from '../../shared/LayerManager';
import constants from '../../shared/constants';

export {
    Header as DrawerHeader,
    Body as DrawerBody,
    Footer as DrawerFooter,
} from '../../shared/styles';

export enum DRAWER_POSITION {
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
    BOTTOM = 'BOTTOM',
}

const positionStyle = (size: string) => ({
    [DRAWER_POSITION.LEFT]: {
        before: `height: 100vh; min-width: ${size || '300px'}; transform: translateX(-100%);`,
        after:'transform: translateX(0%);',
    },
    [DRAWER_POSITION.RIGHT]: {
        before: `height: 100vh; min-width: ${size || '300px'}; transform: translateX(100%);`,
        after:'transform: translateX(0%);',
    },
    [DRAWER_POSITION.BOTTOM]: {
        before: `
            position: absolute;
            bottom: 0;
            width: 100%;
            height: ${size || '90vh'};
            transform: translateY(100%);
            border-radius: 15px 15px 0 0; 
        `,
        after:'transform: translateX(0%);',
    },
});

const DrawerDiv = styled.div<{position: DRAWER_POSITION, size: string}>`
    display: flex;
    flex-direction: column;
    background-color: #fff;
    transition: transform .3s ease;
    box-shadow: var(--modal-shadow, ${constants.MODAL_SHADOW});
    ${props => positionStyle(props.size)[props.position].before}

    .nf-layer-enter & {
        transform: translateX(0%);
        ${props => positionStyle(props.size)[props.position].after}
    }
`;

type DrawerProps = PropTypes.InferProps<typeof Drawer.propTypes>;
interface DrawerState {
    open: boolean,
}

const positionMap = {
    [DRAWER_POSITION.LEFT]: LAYER_POSITION.TOP_LEFT,
    [DRAWER_POSITION.RIGHT]: LAYER_POSITION.TOP_RIGHT,
    [DRAWER_POSITION.BOTTOM]: LAYER_POSITION.BOTTOM_LEFT,
}

export default class Drawer extends React.Component<DrawerProps, DrawerState> {
    state = {
        open: false,
    }

    static propTypes = {
        /** Opens the drawer */
        open: PropTypes.bool.isRequired,
        /** position of the drawer */
        position: PropTypes.oneOf([
            DRAWER_POSITION.LEFT,
            DRAWER_POSITION.RIGHT,
            DRAWER_POSITION.BOTTOM,
        ]),
        /** size of the drawer */
        size: PropTypes.string,
        /** Shows an overlay behind the drawer. */
        overlay: PropTypes.bool,
        /** Closes the drawer on esc */
        closeOnEsc: PropTypes.bool,
        /** Closes the drawer on overlay click */
        closeOnOverlayClick: PropTypes.bool,
        /** Call back function called when the drawer closes. */
        onClose: PropTypes.func,
    }

    static defaultProps = {
        overlay: true,
        position: DRAWER_POSITION.LEFT,
        closeOnEsc: true,
        closeOnOverlayClick: true,
    }

    static getDerivedStateFromProps(props: DrawerProps) {
        if (props.open) {
            return {
                open: true,
            }
        }
        return null;
    }

    private layer: ReturnType<typeof LayerManager.renderLayer>;

    private closeCallback: (resp?: any) => void;

    private onClose = () => {
        this.setState({
            open: false,
        });
        this.props.onClose && this.props.onClose();
        this.closeCallback = null;
        this.layer = null;
    }

    getSnapshotBeforeUpdate(prevProps: DrawerProps) {
        const {
            open, closeOnEsc, closeOnOverlayClick,
            overlay, position, children, size, ...rest } = this.props;

        if (prevProps.open && !open) {
            this.closeCallback && this.closeCallback();
        }

        if (!prevProps.open && open) {
            this.layer = LayerManager.renderLayer({
                overlay,
                exitDelay: 300,
                position: positionMap[position],
                closeCallback: this.onClose,
                closeOnEsc,
                closeOnOverlayClick,
                component: (
                    <DrawerDiv {...rest} position={position} size={size} onClick={e => e.stopPropagation()}>
                        {children}
                    </DrawerDiv>
                )
            });
            this.closeCallback = this.layer[1];
            this.forceUpdate();
        }
    }

    render() {
        if (this.state.open && this.layer) {
            const [Component] = this.layer;
            return <Component />;
        }
    
        return null;
    }
}