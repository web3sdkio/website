import { MobileMenu } from "./nav/MobileMenu";
import { Products } from "./nav/Products";
import { Resources } from "./nav/Resources";
import {
  Box,
  Container,
  Flex,
  Icon,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { SiDiscord } from "@react-icons/all-files/si/SiDiscord";
import { SiTwitter } from "@react-icons/all-files/si/SiTwitter";
import { SiYoutube } from "@react-icons/all-files/si/SiYoutube";
import { Logo } from "components/logo";
import React, { useState } from "react";
import { LinkButton, TrackedIconButton, TrackedLink } from "tw-components";

export const HomepageTopNav: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isScrolled, setIsScrolled] = useState(false);

  useScrollPosition(
    ({ currPos }) => {
      if (currPos.y < -5) {
        setIsScrolled(true);
      } else if (currPos.y >= -5) {
        setIsScrolled(false);
      }
    },
    [isMobile],
    undefined,
    false,
    100,
  );

  return (
    <>
      <Box
        transition="all 100ms"
        position="sticky"
        top={0}
        left={0}
        w="100%"
        zIndex="overlay"
        as="header"
        bgColor={isScrolled ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0)"}
        backdropFilter={
          isScrolled ? "saturate(180%) blur(20px)" : "saturate(100%) blur(0px)"
        }
      >
        <Container
          as={Flex}
          py={4}
          maxW="container.page"
          justify="space-between"
          align="center"
          flexDir="row"
        >
          <TrackedLink href="/" category="topnav" label="home">
            <Logo color="#fff" />
          </TrackedLink>
          <Flex gap={8}>
            <Stack
              display={["none", "none", "flex"]}
              direction="row"
              alignItems="center"
              color="gray.50"
              fontWeight="bold"
              spacing={10}
              as="nav"
            >
              <Products />
              <Resources />
              <TrackedLink
                isExternal
                href="https://careers.web3sdk.io"
                category="landing-page"
                label="careers"
              >
                Careers
              </TrackedLink>
            </Stack>

            <Flex
              display={{ base: "none", md: "flex" }}
              direction="row"
              align="center"
            >
              <TrackedIconButton
                as={LinkButton}
                isExternal
                noIcon
                href="https://twitter.com/web3sdkio"
                color="gray.50"
                bg="transparent"
                aria-label="twitter"
                icon={<Icon boxSize="1rem" as={SiTwitter} />}
                category="topnav"
                label="twitter"
              />
              <TrackedIconButton
                as={LinkButton}
                isExternal
                noIcon
                href="https://discord.gg/n33UhsfUKB"
                bg="transparent"
                color="gray.50"
                aria-label="discord"
                icon={<Icon boxSize="1rem" as={SiDiscord} />}
                category="topnav"
                label="discord"
              />
              <TrackedIconButton
                as={LinkButton}
                isExternal
                noIcon
                href="https://www.youtube.com/channel/UCdzMx7Zhy5va5End1-XJFbA"
                bg="transparent"
                color="gray.50"
                aria-label="YouTube"
                icon={<Icon boxSize="1rem" as={SiYoutube} />}
                category="topnav"
                label="youtube"
              />
            </Flex>
          </Flex>

          <MobileMenu
            aria-label="Homepage Menu"
            display={{ base: "inherit", md: "none" }}
          />
        </Container>
      </Box>
      <Box h="32px" w="100%" display={["block", "block", "none"]} />
    </>
  );
};
