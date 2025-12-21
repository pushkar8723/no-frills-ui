import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

type StepProps = {
    /**
     * Name of the step to be displayed in the header
     */
    name: string;
    /**
     * Disables the step
     * @default false
     */
    disabled?: boolean;
    /**
     * Marks the step as completed
     * @default false
     */
    completed?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Step Component
 * @param props - Component props
 * @param ref - Ref forwarded to the underlying HTMLDivElement
 */
function StepComponent(props: React.PropsWithChildren<StepProps>, ref: React.Ref<HTMLDivElement>) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, disabled, completed, ...rest } = props;
    return <Container {...rest} ref={ref} />;
}

const Step = React.forwardRef(StepComponent);
export default Step;
