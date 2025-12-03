import React from 'react';
import styled from '@emotion/styled';

interface StepProps {
    /** Name of the step to be displayed in the header */
    name: string;
    /** Disables the step */
    disabled?: boolean;
    /** Marks the step as completed */
    completed?: boolean;
}

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

export default function Step(props: React.PropsWithChildren<StepProps>) {
    const { name, disabled, completed, ...rest } = props;
    return <Container {...rest} />;
}

Step.defaultProps = {
    disabled: false,
    completed: false,
};
