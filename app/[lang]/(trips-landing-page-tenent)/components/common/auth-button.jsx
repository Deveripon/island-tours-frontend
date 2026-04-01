'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Logout01Icon, UserIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

export const AuthButton = ({ tenantId, variant, onClose, ...props }) => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const isAccountPage = pathname.includes('account');

    const loggedInCustomer = session?.userType === 'customer' && session?.user;

    if (status === 'loading') {
        return null;
    }

    if (loggedInCustomer) {
        return (
            <>
                {!isAccountPage && (
                    <Button
                        size={props.size || 'sm'}
                        variant={variant}
                        {...props}
                        onClick={() => {
                            router.push(`/site/${tenantId}/account`);
                            onClose && onClose();
                        }}
                        className={cn(
                            'transition-all duration-300 text-primary-foreground dark:text-primary-foreground'
                        )}>
                        <HugeiconsIcon icon={UserIcon} className='h-4 w-4' /> Go to Account
                    </Button>
                )}

                <Button
                    size={props.size || 'sm'}
                    variant='outline'
                    {...props}
                    onClick={() => {
                        signOut();
                        onClose && onClose();
                    }}
                    className={cn(
                        'transition-all duration-300 border-border dark:border-border hover:bg-accent dark:hover:bg-accent'
                    )}>
                    <HugeiconsIcon icon={Logout01Icon} className='h-4 w-4' /> Logout
                </Button>
            </>
        );
    }

    return (
        !loggedInCustomer && (
            <Button
                size={props.size || 'sm'}
                variant={variant}
                {...props}
                onClick={() => {
                    router.push(`/site/${tenantId}/sign-in`);
                    onClose && onClose();
                }}
                className={cn(
                    'transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/80',
                    props.className
                )}>
                Sign In
            </Button>
        )
    );
};

