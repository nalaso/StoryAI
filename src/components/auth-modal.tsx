'use client'
import { useAuthModal } from "@/hooks/useAuthModal";
import { useState } from 'react';
import { signInGoogle } from '@/actions/auth/sign-in';
import { Modal, ModalBody, ModalContent, ModalHeader, Button, Spinner } from '@nextui-org/react';

const AuthModal = () => {
    const { isOpen, toggle } = useAuthModal();
    const [loading, setLoading] = useState(false)

    const handleSignIn = async () => {
        setLoading(true)
        await signInGoogle()
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={toggle}>
            <ModalContent className="sm:max-w-[425px]">
                <ModalHeader>
                    <h3>Sign in to StoryAI</h3>
                </ModalHeader>
                <ModalBody className="py-4">
                    <Button
                        className='w-full py-6'
                        variant="bordered"
                        type="submit"
                        onClick={() => handleSignIn()}
                        disabled={loading}
                    >
                        {loading ? (
                            <Spinner />
                        ) : (
                            <>
                                Sign in with Google
                            </>
                        )}
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default AuthModal