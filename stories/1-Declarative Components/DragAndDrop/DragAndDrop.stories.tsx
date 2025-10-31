import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { DragAndDrop, ORIENTATION } from '../../../src/components';
import DragAndDropDemo from '../../resources/DragAndDropDemo';

const meta: Meta<typeof DragAndDrop> = {
  component: DragAndDrop,
  title: 'Declarative Components/DragAndDrop',
  tags: ['!dev', '!autodocs'],
};

export default meta;
type Story = StoryObj<typeof DragAndDrop>;

export const VerticalLayout: Story = {
  render: () => (
    <div style={{ backgroundColor: '#ccccff', padding: '20px' }}>
      <DragAndDropDemo orientation={ORIENTATION.VERTICAL} />
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `import React, { useState } from 'react';
import { DragAndDrop, ORIENTATION } from 'no-frills-ui';

export default function DragAndDropDemo(prop) {
    const [items, setItems] = useState(['Item #1', 'Item #2', 'Item #3', 'Item #4', 'Item #5']);

    const onDrop = (start, end) => {
        // Clone existing elements
        const newItems = [...items];
        // Remove the element to be moved
        const item = newItems.splice(start, 1);
        // Add it back at the required position
        newItems.splice(end, 0, item[0]);
        // Update
        setItems(newItems);
    }

    return (<DragAndDrop orientation={ORIENTATION.VERTICAL} onDrop={onDrop}>
        {items.map(item => <div>{item}</div>)}
    </DragAndDrop>)
}`,
      },
    },
  },
};

export const HorizontalLayout: Story = {
  render: () => (
    <div style={{ backgroundColor: '#ccccff', padding: '20px' }}>
      <DragAndDropDemo orientation={ORIENTATION.HORIZONTAL} />
    </div>
  ),
};

export const HorizontalWithIndicators: Story = {
  render: () => (
    <div style={{ backgroundColor: '#ccccff', padding: '20px' }}>
      <DragAndDropDemo showIndicator orientation={ORIENTATION.HORIZONTAL} />
    </div>
  ),
};

export const Primary: Story = {
  // @ts-ignore - This is for Controls only
  render: (args) => <DragAndDrop {...args} />,
};
