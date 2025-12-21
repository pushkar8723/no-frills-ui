import React from 'react';
import styled from '@emotion/styled';
import { THEME_NAME, getThemeValue } from '../../shared/constants';

export enum BADGE_TYPE {
    PRIMARY = 'primary',
    SUCCESS = 'success',
    WARNING = 'warning',
    DANGER = 'danger',
    DISABLED = 'disabled',
}

const BadgeSpan = styled.span<BadgeProps>`
    background-color: ${(props) => {
        switch (props.type) {
            case BADGE_TYPE.SUCCESS:
                return getThemeValue(THEME_NAME.SUCCESS);

            case BADGE_TYPE.WARNING:
                return getThemeValue(THEME_NAME.WARNING);

            case BADGE_TYPE.DANGER:
                return getThemeValue(THEME_NAME.ERROR);

            case BADGE_TYPE.DISABLED:
                return getThemeValue(THEME_NAME.DISABLED);

            default:
                return getThemeValue(THEME_NAME.PRIMARY);
        }
    }};
    color: ${getThemeValue(THEME_NAME.TEXT_COLOR_LIGHT)};
    border-radius: 10px;
    padding: ${(props) => (props.children ? '3px 10px' : '4px')};
    display: inline-block;
    min-height: 4px;
    min-width: 4px;
    font-size: 12px;
    margin: ${(props) => (props.inline ? '0 5px' : '0')};

    ${(props) =>
        !props.inline && 'position: absolute; top: 0; right: 0; transform: translate(50%, -50%);'};
`;

type BadgeProps = {
    /**
     * Display badge inline or overlay on parent component
     * @default false
     */
    inline?: boolean;
    /** Type of badge
     * @default BADGE_TYPE.PRIMARY
     */
    type?: BADGE_TYPE;
} & React.HTMLAttributes<HTMLSpanElement>;

/**
 * Badge Component
 * @param props - Component props
 * @param ref - Ref forwarded to the underlying HTMLSpanElement
 */
function BadgeComponent(props: BadgeProps, ref: React.Ref<HTMLSpanElement>) {
    return <BadgeSpan {...props} ref={ref} />;
}

const Badge = React.forwardRef<HTMLSpanElement, React.PropsWithChildren<BadgeProps>>(
    BadgeComponent,
);

export default Badge;
