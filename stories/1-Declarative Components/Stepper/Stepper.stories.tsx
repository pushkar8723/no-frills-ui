import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Stepper, Step, StepBody, StepFooter } from '../../../src/components/Stepper';
import { Card } from '../../../src/components/Card';
import { Button, ActionButton } from '../../../src/components/Button';

const meta: Meta<typeof Stepper> = {
  component: Stepper,
  title: 'Declarative Components/Stepper',
  tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof Stepper>;

export const Demo: Story = {
  render: () => (
    <div style={{ background: 'linear-gradient(to right, #00b09b, #96c93d)', padding: '20px' }}>
      <Card>
        <Stepper active={1}>
          <Step name='Welcome' completed>
            <StepBody>
              Welcome to this multi-step form.
            </StepBody>
            <StepFooter>
              <ActionButton>Next</ActionButton>
            </StepFooter>
          </Step>
          <Step name='Basic Details'>
            <StepBody>
              Enter your details here.
            </StepBody>
            <StepFooter>
              <Button>Prev</Button>
              <ActionButton>Next</ActionButton>
            </StepFooter>
          </Step>
          <Step name='Personalisation' disabled>
            <StepBody>
              Personalize your view here.
            </StepBody>
          </Step>
          <Step name='Verification'>
            <StepBody>
              Verify if you are human.
            </StepBody>
          </Step>
        </Stepper>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `import { Stepper, Step, StepBody, StepFooter } from 'no-frills-ui';

// render
<Stepper active={1}>
    <Step name='Welcome' completed>
        <StepBody>
            Welcome to this multi-step form.
        </StepBody>
        <StepFooter>
            <ActionButton>Next</ActionButton>
        </StepFooter>
    </Step>
    <Step name='Basic Details'>
        <StepBody>
            Enter your details here.
        </StepBody>
        <StepFooter>
            <Button>Prev</Button>
            <ActionButton>Next</ActionButton>
        </StepFooter>
    </Step>
    <Step name='Personalisation' disabled>
        <StepBody>
            Personalize your view here.
        </StepBody>
    </Step>
    <Step name='Verification'>
        <StepBody>
            Verify if you are human.
        </StepBody>
    </Step>
</Stepper>`,
      },
    },
  },
};

export const StepperProps: Story = {
  // @ts-ignore - This is for Controls only
  render: (args) => <Stepper {...args} />,
};

export const StepProps: Story = {
  // @ts-ignore - This is for Controls only
  render: (args) => <Step {...args} />,
};
