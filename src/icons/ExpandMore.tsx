import React from 'react';

export default function ExpandMore(props: any) {
    return (
        <svg viewBox="0 0 24 24" width="18px" height="18px" {...props}>
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
        </svg>
    );
}
