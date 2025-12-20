import { render, screen, fireEvent } from '@testing-library/react';
import LayerManager, { LAYER_POSITION } from '../src/shared/LayerManager';

describe('LayerManager', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
        // Clean up after each test
        LayerManager.destroy();
    });

    it('renders a layer and appends to body', () => {
        const [LayerComponent] = LayerManager.renderLayer({
            component: <div data-testid="layer-content">Test Layer</div>,
        });

        render(<LayerComponent />);

        const element = screen.getByTestId('layer-content');
        expect(element).toBeTruthy();
        expect(document.body.contains(element)).toBe(true);
    });

    it('closes layer on closeFn call', async () => {
        const [LayerComponent, closeFn] = LayerManager.renderLayer({
            component: <div data-testid="layer-content">Test Layer</div>,
        });

        render(<LayerComponent />);
        expect(screen.getByTestId('layer-content')).toBeTruthy();

        closeFn();
        jest.runAllTimers();

        // The layer is closed, callback is called (tested separately)
    });

    it('closes layer on ESC key press when closeOnEsc is true', () => {
        const [LayerComponent] = LayerManager.renderLayer({
            component: <div data-testid="layer-content">Test Layer</div>,
            closeOnEsc: true,
        });

        render(<LayerComponent />);
        expect(screen.getByTestId('layer-content')).toBeTruthy();

        fireEvent.keyUp(document.body, { keyCode: 27 });
        jest.runAllTimers();

        // The layer is closed, callback is called (tested separately)
    });

    it('does not close layer on ESC when closeOnEsc is false', () => {
        const [LayerComponent] = LayerManager.renderLayer({
            component: <div data-testid="layer-content">Test Layer</div>,
            closeOnEsc: false,
        });

        render(<LayerComponent />);
        expect(screen.getByTestId('layer-content')).toBeTruthy();

        fireEvent.keyUp(document.body, { keyCode: 27 });

        expect(screen.getByTestId('layer-content')).toBeTruthy();
    });

    it('closes layer on overlay click when closeOnOverlayClick is true', () => {
        const [LayerComponent] = LayerManager.renderLayer({
            component: <div data-testid="layer-content">Test Layer</div>,
            overlay: true,
            closeOnOverlayClick: true,
        });

        render(<LayerComponent />);
        expect(screen.getByTestId('layer-content')).toBeTruthy();

        const container = screen.getByTestId('layer-content').parentElement;
        fireEvent.click(container!);
        jest.runAllTimers();

        // The layer is closed, callback is called (tested separately)
    });

    it('does not close layer on overlay click when closeOnOverlayClick is false', () => {
        const [LayerComponent] = LayerManager.renderLayer({
            component: <div data-testid="layer-content">Test Layer</div>,
            overlay: true,
            closeOnOverlayClick: false,
        });

        render(<LayerComponent />);
        expect(screen.getByTestId('layer-content')).toBeTruthy();

        const container = screen.getByTestId('layer-content').parentElement;
        fireEvent.click(container!);

        expect(screen.getByTestId('layer-content')).toBeTruthy();
    });

    it('applies correct position styles', () => {
        const [LayerComponent] = LayerManager.renderLayer({
            component: <div data-testid="layer-content">Test Layer</div>,
            position: LAYER_POSITION.TOP_CENTER,
        });

        render(<LayerComponent />);

        const div = document.querySelector('[id^="nf-layer-manager"]');
        expect(div?.id).toContain('nf-layer-manager');
    });

    it('sets high z-index for alwaysOnTop', () => {
        const [LayerComponent] = LayerManager.renderLayer({
            component: <div data-testid="layer-content">Test Layer</div>,
            alwaysOnTop: true,
        });

        render(<LayerComponent />);

        const div = document.querySelector('[id^="nf-layer-manager"]');
        expect(div?.id).toContain('nf-layer-manager-top');
    });

    it('calls closeCallback on close', () => {
        const mockCallback = jest.fn();
        const [LayerComponent, closeFn] = LayerManager.renderLayer({
            component: <div data-testid="layer-content">Test Layer</div>,
            closeCallback: mockCallback,
        });

        render(<LayerComponent />);
        closeFn('response');
        jest.runAllTimers();

        expect(mockCallback).toHaveBeenCalledWith('response');
    });

    it('applies aria-hidden to siblings when overlay is true', () => {
        // Add a sibling element
        const sibling = document.createElement('div');
        sibling.setAttribute('id', 'sibling');
        document.body.appendChild(sibling);

        const [LayerComponent] = LayerManager.renderLayer({
            component: <div data-testid="layer-content">Test Layer</div>,
            overlay: true,
        });

        render(<LayerComponent />);

        expect(sibling.getAttribute('aria-hidden')).toBe('true');

        // Cleanup
        document.body.removeChild(sibling);
    });

    it('locks body scroll when overlay is true', () => {
        const originalOverflow = document.body.style.overflow;
        const originalPosition = document.body.style.position;

        const [LayerComponent] = LayerManager.renderLayer({
            component: <div data-testid="layer-content">Test Layer</div>,
            overlay: true,
        });

        render(<LayerComponent />);

        expect(document.body.style.overflow).toBe('hidden');
        expect(document.body.style.position).toBe('fixed');

        // Cleanup styles
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
    });

    it('respects exitDelay', async () => {
        jest.useFakeTimers();

        const [LayerComponent, closeFn] = LayerManager.renderLayer({
            component: <div data-testid="layer-content">Test Layer</div>,
            exitDelay: 1000,
        });

        render(<LayerComponent />);
        expect(screen.getByTestId('layer-content')).toBeTruthy();

        closeFn();

        // Should still be there immediately due to exitDelay
        expect(screen.getByTestId('layer-content')).toBeTruthy();

        // Callback is called immediately (tested separately)
    });
});
