import React from 'react';
import PropTypes from 'prop-types';
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

export default function Badge(props: BadgeProps) {
    return <BadgeSpan {...props} />;
}

Badge.propTypes = {
    /** Display badge inline or overlay on parent component */
    inline: PropTypes.bool,
    /** Type of badge */
    type: PropTypes.oneOf([
        BADGE_TYPE.PRIMARY,
        BADGE_TYPE.SUCCESS,
        BADGE_TYPE.WARNING,
        BADGE_TYPE.DANGER,
        BADGE_TYPE.DISABLED,
    ]),
    css: PropTypes.any,
};

type BadgeProps = React.PropsWithChildren<PropTypes.InferProps<typeof Badge.propTypes>>;

Badge.defaultProps = {
    inline: false,
    type: BADGE_TYPE.PRIMARY,
};
