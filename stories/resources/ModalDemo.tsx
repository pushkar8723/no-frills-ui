import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../src/components/Modal';
import { Button } from '../../src/components';

export default function ModalDemo() {
    const [open, setOpen] = useState(false);

    return (
        <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal open={open} onClose={() => setOpen(false)}>
            <ModalHeader>A Custom Modal</ModalHeader>
            <ModalBody>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </ModalBody>
            <ModalFooter>
                <Button onClick={() => setOpen(false)}>Close</Button>
            </ModalFooter>
        </Modal>
        </>
    )
}