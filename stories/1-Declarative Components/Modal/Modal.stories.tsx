import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from '../../../src/components';
import ModalDemo from '../../resources/ModalDemo';

const meta: Meta<typeof Modal> = {
  component: Modal,
  title: 'Declarative Components/Modal',
  tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Demo: Story = {
  render: () => (
    <div style={{ background: 'linear-gradient(to right, #00b09b, #96c93d)', padding: '20px', minHeight: '200px' }}>
      <ModalDemo />
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `import { useState } from 'react';
import { Modal, ModalBody, ModalFooter } from 'no-frills-ui';

const [open, setOpen] = useState(false);

// render
<Modal open={open} onClose={() => setOpen(false)}>
    <ModalBody>
        This will always render on top.
    </ModalBody>
    <ModalFooter>
        <button onClick={() => setOpen(false)}></button>
    </ModalFooter>
</Modal>`,
      },
    },
  },
};

export const Primary: Story = {
  // @ts-ignore - This is for Controls only
  render: (args) => <Modal {...args} />,
};
