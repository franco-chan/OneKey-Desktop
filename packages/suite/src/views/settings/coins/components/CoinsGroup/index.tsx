import React from 'react';
import styled from 'styled-components';
import { P, Switch, Icon, variables, Button, useTheme } from '@trezor/components';
import { Translation } from '@suite-components';
import { NETWORKS } from '@wallet-config';
import { UnavailableCapability } from '@onekeyhq/connect';
import { Network } from '@wallet-types';
import { Section, ActionColumn, Row } from '@suite-components/Settings';
import { useDevice, useActions } from '@suite-hooks';
import * as modalActions from '@suite-actions/modalActions';
import Coin from '../Coin';

const Wrapper = styled.div`
    margin: 4px 0 0 0;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
`;

const StyledP = styled(P)`
    margin-top: 4px;
`;

const Left = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
`;

const Right = styled.div`
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
`;

const Title = styled.div`
    font-size: ${variables.FONT_SIZE.TINY};
    color: ${props => props.theme.TYPE_DARK_GREY};
    text-transform: uppercase;
    font-weight: ${variables.FONT_WEIGHT.DEMI_BOLD};
`;

const Buttons = styled.div`
    display: flex;
`;

const AdvancedSettings = styled.div`
    display: flex;
    cursor: pointer;
    font-size: ${variables.FONT_SIZE.TINY};
    color: ${props => props.theme.TYPE_DARK_GREY};
    /* todo: not in variables but is in design */
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
    margin-right: 12px;
    visibility: hidden;
    align-items: center;

    @media all and (max-width: ${variables.SCREEN_SIZE.SM}) {
        visibility: visible;
    }
`;

const UnavailableLabel = styled.div`
    font-size: ${variables.FONT_SIZE.TINY};
    color: ${props => props.theme.TYPE_DARK_GREY};
    white-space: nowrap;
`;

const SettingsIconWrapper = styled.div`
    margin-right: 0.5ch;
`;

const StyledButton = styled(Button)`
    & + & {
        margin-left: 16px;
    }
`;

const CoinRow = styled(Row)`
    &:hover ${AdvancedSettings} {
        visibility: visible;
    }
`;

const AdvancedSettingsText = styled.div`
    @media all and (max-width: ${variables.SCREEN_SIZE.SM}) {
        display: none;
    }
`;

interface Props {
    label: React.ReactNode;
    description?: React.ReactNode;
    onActivateAll: () => void;
    onDeactivateAll: () => void;
    onToggleOneFn: (symbol: Network['symbol'], visible: boolean) => void;
    filterFn: (n: Network) => boolean;
    enabledNetworks: Network['symbol'][];
    type: 'mainnet' | 'testnet'; // used in tests
    unavailableCapabilities: { [key: string]: UnavailableCapability };
}

const Unavailable = ({ type }: { type: UnavailableCapability }) => {
    switch (type) {
        case 'no-capability':
            return <Translation id="FW_CAPABILITY_NO_CAPABILITY" />;
        case 'no-support':
            return <Translation id="FW_CAPABILITY_NO_SUPPORT" />;
        case 'update-required':
            return <Translation id="FW_CAPABILITY_UPDATE_REQUIRED" />;
        // case '@onekeyhq/connect-outdated':
        default:
            return <Translation id="FW_CAPABILITY_CONNECT_OUTDATED" />;
    }
};

const CoinsGroup = ({
    label,
    description,
    onActivateAll,
    onDeactivateAll,
    onToggleOneFn,
    filterFn,
    enabledNetworks,
    unavailableCapabilities,
    ...props
}: Props) => {
    const { openModal } = useActions({
        openModal: modalActions.openModal,
    });
    const { isLocked } = useDevice();
    const isDeviceLocked = isLocked();
    const theme = useTheme();
    return (
        <Wrapper data-test="@settings/wallet/coins-group">
            <Section
                customHeader={
                    <Header>
                        <Left>
                            <Title>{label}</Title>
                            {description && <StyledP size="tiny">{description}</StyledP>}
                        </Left>
                        <Right>
                            <Buttons>
                                <StyledButton
                                    isDisabled={
                                        isDeviceLocked ||
                                        NETWORKS.filter(filterFn).length === enabledNetworks.length
                                    }
                                    variant="tertiary"
                                    icon="CHECK"
                                    onClick={() => onActivateAll()}
                                    data-test={`@settings/wallet/coins-group/${props.type}/activate-all`}
                                >
                                    <Translation id="TR_ACTIVATE_ALL" />
                                </StyledButton>
                                <StyledButton
                                    isDisabled={isDeviceLocked || enabledNetworks.length === 0}
                                    variant="tertiary"
                                    icon="CROSS"
                                    onClick={() => onDeactivateAll()}
                                    data-test={`@settings/wallet/coins-group/${props.type}/deactivate-all`}
                                >
                                    <Translation id="TR_DEACTIVATE_ALL" />
                                </StyledButton>
                            </Buttons>
                        </Right>
                    </Header>
                }
            >
                {NETWORKS.filter(filterFn).map(network => (
                    <CoinRow key={network.symbol}>
                        <Coin symbol={network.symbol} name={network.name} />
                        <ActionColumn>
                            {!unavailableCapabilities[network.symbol] && (
                                <>
                                    <AdvancedSettings
                                        onClick={() =>
                                            openModal({
                                                type: 'advanced-coin-settings',
                                                coin: network.symbol,
                                            })
                                        }
                                    >
                                        <SettingsIconWrapper>
                                            <Icon
                                                icon="SETTINGS"
                                                size={16}
                                                color={theme.TYPE_DARK_GREY}
                                            />
                                        </SettingsIconWrapper>
                                        <AdvancedSettingsText>
                                            <Translation id="TR_ADVANCED_SETTINGS" />
                                        </AdvancedSettingsText>
                                    </AdvancedSettings>
                                    <Switch
                                        data-test={`@settings/wallet/network/${network.symbol}`}
                                        onChange={(visible: boolean) => {
                                            onToggleOneFn(network.symbol, visible);
                                        }}
                                        checked={enabledNetworks.includes(network.symbol)}
                                        isDisabled={isDeviceLocked}
                                    />
                                </>
                            )}
                            {unavailableCapabilities[network.symbol] && (
                                <UnavailableLabel>
                                    <Unavailable type={unavailableCapabilities[network.symbol]} />
                                </UnavailableLabel>
                            )}
                        </ActionColumn>
                    </CoinRow>
                ))}
            </Section>
        </Wrapper>
    );
};

export default CoinsGroup;
