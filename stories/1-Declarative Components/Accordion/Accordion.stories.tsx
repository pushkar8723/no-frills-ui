import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Accordion, AccordionStep, AccordionStepBody, AccordionStepFooter } from '../../../src/components/Accordion';
import { Button, ActionButton } from '../../../src/components/Button';
import { Dummy } from '../../resources/Dummy';

const meta: Meta<typeof Accordion> = {
  component: Accordion,
  title: 'Declarative Components/Accordion',
  tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    render: () => (
        <Accordion>
            {/* @ts-ignore - Accordion injects onStepClick and open props */}
            <AccordionStep header='Welcome' completed>
                <AccordionStepBody>
                    <Dummy>Dummy content for Welcome step</Dummy>
                </AccordionStepBody>
                <AccordionStepFooter>
                    <Button>Previous</Button>
                    <ActionButton>Next</ActionButton>
                </AccordionStepFooter>
            </AccordionStep>
            {/* @ts-ignore */}
            <AccordionStep header='Basic Details' completed>
                <Dummy>Dummy content for Basic Details step</Dummy>
            </AccordionStep>
            {/* @ts-ignore */}
            <AccordionStep header='Personalisation' errorText='3 Errors' disabled>
                <Dummy>Dummy content for Personalisation step</Dummy>
            </AccordionStep>
            {/* @ts-ignore */}
            <AccordionStep header='Verification'>
                <Dummy>Dummy content for Verification step</Dummy>
            </AccordionStep>
        </Accordion>
    ),
    parameters: {
        docs: {
            source: {
                code: `<Accordion>
    <AccordionStep header='Welcome' completed>
        <AccordionStepBody>
            <Dummy>Dummy content for Welcome step</Dummy>
        </AccordionStepBody>
        <AccordionStepFooter>
            <Button>Previous</Button>
            <ActionButton>Next</ActionButton>
        </AccordionStepFooter>
    </AccordionStep>
    <AccordionStep header='Basic Details' completed>
        <Dummy>Dummy content for Basic Details step</Dummy>
    </AccordionStep>
    <AccordionStep header='Personalisation' errorText='3 Errors' disabled>
        <Dummy>Dummy content for Personalisation step</Dummy>
    </AccordionStep>
    <AccordionStep header='Verification'>
        <Dummy>Dummy content for Verification step</Dummy>
    </AccordionStep>
</Accordion>`
            }
        }
    }
};

// Props documentation story
export const AccordionProps: Story = {
    render: () => <Accordion><div /></Accordion>,
    args: {},
};

// Props documentation story for AccordionStep
export const AccordionStepProps: Story = {
    render: () => <AccordionStep header="Step Header" onStepClick={() => {}} open={false} />,
    args: {
        header: 'Step Header',
    },
};
