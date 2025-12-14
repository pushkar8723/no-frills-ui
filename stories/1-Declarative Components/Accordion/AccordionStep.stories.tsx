import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { AccordionStep } from '../../../src/components/Accordion';

const meta: Meta<typeof AccordionStep> = {
    component: AccordionStep as never,
    title: 'Declarative Components/Accordion/AccordionStep',
    tags: ['!dev', '!autodocs'],
    argTypes: {
        open: { table: { disable: true }, control: { disable: true } },
        onStepClick: { table: { disable: true }, control: { disable: true } },
    },
};

export default meta;
type Story = StoryObj<typeof AccordionStep>;

// Props documentation story for AccordionStep
export const AccordionStepProps: Story = {
    render: () => <AccordionStep header="Step Header" onStepClick={() => {}} open={false} />,
};
