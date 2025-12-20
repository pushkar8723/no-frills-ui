import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Badge, { BADGE_TYPE } from '../../../src/components/Badge/Badge';

expect.extend(toHaveNoViolations);

describe('Badge', () => {
    it('renders correctly', () => {
        const { getByText } = render(<Badge>New</Badge>);
        expect(getByText('New')).toBeInTheDocument();
    });

    it('is accessible', async () => {
        const { container } = render(<Badge>New</Badge>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLSpanElement>();
        render(<Badge ref={ref}>New</Badge>);
        expect(ref.current).toBeInTheDocument();
        expect(ref.current?.tagName).toBe('SPAN');
    });

    it('renders with different types', () => {
        const { rerender, getByText } = render(<Badge type={BADGE_TYPE.SUCCESS}>Success</Badge>);
        expect(getByText('Success')).toBeInTheDocument();

        rerender(<Badge type={BADGE_TYPE.WARNING}>Warning</Badge>);
        expect(getByText('Warning')).toBeInTheDocument();

        rerender(<Badge type={BADGE_TYPE.DANGER}>Danger</Badge>);
        expect(getByText('Danger')).toBeInTheDocument();

        rerender(<Badge type={BADGE_TYPE.DISABLED}>Disabled</Badge>);
        expect(getByText('Disabled')).toBeInTheDocument();
    });

    it('renders inline', () => {
        const { getByText } = render(<Badge inline>New</Badge>);
        expect(getByText('New')).toBeInTheDocument();
    });

    it('renders without children', () => {
        const { container } = render(<Badge />);
        expect(container.firstChild).toBeInTheDocument();
    });
});
