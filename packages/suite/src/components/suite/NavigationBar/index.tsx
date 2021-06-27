import React, { useState, ComponentProps, Fragment } from 'react';
import DeviceSelector from './components/DeviceSelector';
import NavigationActions from './components/NavigationActions';
import styled from 'styled-components';
import { Icon, TrezorLogo, useTheme } from '@trezor/components';
import { useLayoutSize, useSelector } from '@suite-hooks';
import { Dialog, Transition } from '@headlessui/react';

const StyledDeviceSelector = styled(DeviceSelector)``;

const StyledNavigationBar = styled.div<{ isMobileLayout: boolean }>`
    display: flex;
    width: 100%;
    min-height: 80px;
    flex: 0;
    z-index: 3;
    padding: ${props => (!props.isMobileLayout ? '6px 32px 6px 8px' : '6px 8px')};
    align-items: center;
    background: ${props => props.theme.BG_WHITE};
    border-bottom: 1px solid ${props => props.theme.STROKE_GREY};

    &:hover ${StyledDeviceSelector} {
        /* apply same device selector's hover styles on hover anywhere in navigation panel */
        border-radius: 4px;
        box-shadow: 0 1px 2px 0 ${props => props.theme.BOX_SHADOW_BLACK_20};
    }
`;

const VerticalNavigationBar = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 281px;
    height: 100%;
    flex: 0;
    z-index: 3;
    padding: 25px 20px 0 10px;
    align-items: center;
    background: ${props => props.theme.BG_NAVBAR};
    border-bottom: 1px solid ${props => props.theme.STROKE_GREY};

    &:hover ${StyledDeviceSelector} {
        /* apply same device selector's hover styles on hover anywhere in navigation panel */
        border-radius: 4px;
        box-shadow: 0 1px 2px 0 ${props => props.theme.BOX_SHADOW_BLACK_20};
    }
`;

const HamburgerWrapper = styled.div`
    display: flex;
    padding-right: 12px;
    flex: 1;
    justify-content: flex-end;
`;

const MobileNavigationWrapper = styled.div`
    position: relative;
    height: 100vh;
`;

const ExpandedMobileNavigation = styled.div`
    display: flex;
    position: absolute;
    flex-direction: column;
    background: ${props => props.theme.BG_WHITE};
    z-index: 3;
    width: 100%;
    height: 100%;
`;

const NavigationBar = () => {
    const [opened, setOpened] = useState(false);
    const { isMobileLayout } = useLayoutSize();
    const userThemeSettings = useSelector(state => state.suite.settings.theme);
    const theme = useTheme();
    const isDarkModeEnabled = userThemeSettings.variant !== 'light';

    const closeMainNavigation = () => {
        setOpened(false);
    };

    return (
        <>
            {/* Header for mobile */}
            <div className="flex justify-between py-1 bg-white border-b border-gray-200 md:hidden dark:bg-black/10 dark:border-white/10">
                {/* Device Selector */}
                <div className="pl-2 w-[160px]">
                    <DeviceSelector />
                </div>
                {/* Menu Button */}
                <button
                    className="p-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand lg:hidden"
                    onClick={() => setOpened(true)}
                    type="button"
                >
                    {/* TODO i18n */}
                    <span className="sr-only">Open sidebar</span>
                    <span className="w-6 h-6" aria-hidden="true">
                        <Icon
                            onClick={() => setOpened(!opened)}
                            icon="MENU"
                            size={24}
                            className="text-gray-500 dark:text-white/50"
                        />
                    </span>
                </button>
            </div>
            {/* Navigation for mobile */}
            <Transition.Root show={opened} as={Fragment}>
                <Dialog
                    as="div"
                    static
                    className="fixed inset-0 z-40 flex md:hidden"
                    open={opened}
                    onClose={setOpened}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-black/50" />
                    </Transition.Child>
                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-in-out duration-300 transform"
                        enterFrom="-translate-x-full"
                        enterTo="translate-x-0"
                        leave="transition ease-in-out duration-300 transform"
                        leaveFrom="translate-x-0"
                        leaveTo="-translate-x-full"
                    >
                        <div className="relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-white dark:bg-[#191919] px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-in-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in-out duration-300"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="absolute top-0 right-0 pt-2 -mr-12">
                                    <button
                                        className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white dark:focus:ring-white/80"
                                        onClick={() => setOpened(false)}
                                        type="button"
                                    >
                                        {/* TODO i18n */}
                                        <span className="sr-only">Close sidebar</span>
                                        <span
                                            className="w-6 h-6 text-white dark:text-white/80"
                                            aria-hidden="true"
                                        >
                                            <Icon
                                                onClick={() => setOpened(!opened)}
                                                icon="CROSS"
                                                size={24}
                                            />
                                        </span>
                                    </button>
                                </div>
                            </Transition.Child>
                            <div className="flex items-center flex-shrink-0">
                                <TrezorLogo
                                    className="self-start pl-[6px]"
                                    type={
                                        `horizontal_${
                                            isDarkModeEnabled ? 'dark' : 'light'
                                        }` as ComponentProps<typeof TrezorLogo>['type']
                                    }
                                    height={27}
                                />
                            </div>
                            <div className="flex flex-col flex-1 h-0 overflow-y-auto">
                                <NavigationActions closeMainNavigation={closeMainNavigation} />
                            </div>
                        </div>
                    </Transition.Child>
                </Dialog>
            </Transition.Root>
            {/* Navigation for desktop */}
            <div className="flex-col hidden px-3 pt-5 pb-4 overflow-y-auto bg-white border-r border-gray-200 lg:px-4 lg:w-64 md:flex md:flex-shrink-0 dark:bg-black/10 dark:border-white/10">
                {/* Branding */}
                <div className="flex items-center flex-shrink-0 pl-[14px] lg:pl-[6px]">
                    <TrezorLogo
                        className="self-start w-[27px] overflow-hidden lg:w-auto"
                        type={
                            `horizontal_${isDarkModeEnabled ? 'dark' : 'light'}` as ComponentProps<
                                typeof TrezorLogo
                            >['type']
                        }
                        height={27}
                    />
                </div>
                {/* Device Selector */}
                <DeviceSelector />
                {/* Links and controls */}
                <NavigationActions />
            </div>
        </>
    );

    // if (isMobileLayout) {
    //     return (
    //         <>
    //             <StyledNavigationBar isMobileLayout={isMobileLayout}>
    //                 <StyledDeviceSelector isMobileLayout={isMobileLayout} />
    //                 <HamburgerWrapper>
    //                     <Icon
    //                         onClick={() => setOpened(!opened)}
    //                         icon={opened ? 'CROSS' : 'MENU'}
    //                         size={24}
    //                         color={theme.TYPE_DARK_GREY}
    //                     />
    //                 </HamburgerWrapper>
    //             </StyledNavigationBar>
    //             {opened && (
    //                 <MobileNavigationWrapper>
    //                     <ExpandedMobileNavigation>
    //                         <NavigationActions closeMainNavigation={closeMainNavigation} />
    //                     </ExpandedMobileNavigation>
    //                 </MobileNavigationWrapper>
    //             )}
    //         </>
    //     );
    // }

    // return (
    //     <VerticalNavigationBar>
    //         <StyledTrezorLogo
    //             type={
    //                 `horizontal_${isDarkModeEnabled ? 'dark' : 'light'}` as ComponentProps<
    //                     typeof TrezorLogo
    //                 >['type']
    //             }
    //             height={35}
    //         />
    //         <StyledDeviceSelector />
    //         <NavigationActions />
    //     </VerticalNavigationBar>
    // );
};

export default NavigationBar;
