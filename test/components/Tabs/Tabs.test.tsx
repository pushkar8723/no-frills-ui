import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Tab, Tabs } from '../../../src/components/Tabs';

expect.extend(toHaveNoViolations);

describe('Tabs', () => {
    it('renders tabs', () => {
        const { getByText } = render(
            <Tabs>
                <Tab name="Tab 1">Content 1</Tab>
                <Tab name="Tab 2">Content 2</Tab>
            </Tabs>,
        );
        expect(getByText('Tab 1')).toBeInTheDocument();
        expect(getByText('Tab 2')).toBeInTheDocument();
    });

    it('shows active tab content', () => {
        const { getByText, queryByText } = render(
            <Tabs active={0}>
                <Tab name="Tab 1">Content 1</Tab>
                <Tab name="Tab 2">Content 2</Tab>
            </Tabs>,
        );
        expect(getByText('Content 1')).toBeInTheDocument();
        expect(queryByText('Content 2')).not.toBeInTheDocument();
    });

    it('switches tabs on click', () => {
        const { getByText } = render(
            <Tabs>
                <Tab name="Tab 1">Content 1</Tab>
                <Tab name="Tab 2">Content 2</Tab>
            </Tabs>,
        );

        const tab2 = getByText('Tab 2');
        fireEvent.click(tab2);

        expect(getByText('Content 2')).toBeInTheDocument();
    });

    it('calls onChange', () => {
        const handleTabChange = jest.fn();
        const { getByText } = render(
            <Tabs onChange={handleTabChange}>
                <Tab name="Tab 1">Content 1</Tab>
                <Tab name="Tab 2">Content 2</Tab>
            </Tabs>,
        );

        const tab2 = getByText('Tab 2');
        fireEvent.click(tab2);

        expect(handleTabChange).toHaveBeenCalledWith(1);
    });

    it('is accessible', async () => {
        const { container } = render(
            <Tabs>
                <Tab name="Tab 1">Content 1</Tab>
            </Tabs>,
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
