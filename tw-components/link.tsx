import {
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
} from "@chakra-ui/react";
import { Link as LocationLink, useMatch } from "@tanstack/react-location";
import { useTrack } from "hooks/analytics/useTrack";
import _NextLink, { LinkProps as _NextLinkProps } from "next/link";
import React, { useCallback } from "react";

interface LinkProps
  extends Omit<ChakraLinkProps, "href">,
    Pick<_NextLinkProps, "href"> {
  isExternal?: boolean;
  noIcon?: true;
  href: string;
  noMatch?: true;
  scroll?: true;
}

/**
 * A link component that can be used to navigate to other pages.
 * Combines the `NextLink` and Chakra `Link` components.
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, isExternal, children, noMatch, scroll, ...restLinkProps }, ref) => {
    const match = useMatch();

    if (isExternal) {
      return (
        <ChakraLink isExternal href={href} ref={ref} {...restLinkProps}>
          {children}
        </ChakraLink>
      );
    }

    // we're in a react location context, so we can use that
    if (match && !noMatch) {
      return (
        <ChakraLink as={LocationLink} to={href} {...restLinkProps}>
          {children}
        </ChakraLink>
      );
    }
    return (
      <_NextLink href={href} passHref scroll={scroll || false}>
        <ChakraLink ref={ref} _focus={{ boxShadow: "none" }} {...restLinkProps}>
          {children}
        </ChakraLink>
      </_NextLink>
    );
  },
);

Link.displayName = "Link";

interface TrackedLinkProps extends LinkProps {
  category: string;
  label?: string;
}

/**
 * A link component extends the `Link` component and adds tracking.
 */
export const TrackedLink = React.forwardRef<
  HTMLAnchorElement,
  TrackedLinkProps
>(({ category, label, ...props }, ref) => {
  const trackEvent = useTrack();

  const onClick = useCallback(() => {
    trackEvent({ category, action: "click", label });
  }, [trackEvent, category, label]);

  return <Link ref={ref} onClick={onClick} {...props} />;
});

TrackedLink.displayName = "TrackedLink";

/**
 * @deprecated Use {@link Link} instead.
 */
export const NextLink = Link;
