import Link, { LinkProps } from 'next/link';
import { ReactNode } from 'react';

interface ConditionalLinkProps extends LinkProps {
    readonly children: ReactNode;
    readonly disabled?: boolean;
}

export function ConditionalLink({ children, disabled, ...props }: ConditionalLinkProps) {
    if (disabled) {
        return children;
    }

    return <Link {...props}>{children}</Link>;
}
