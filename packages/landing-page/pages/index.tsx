import React from 'react';
import styled from 'styled-components';
import Layout from '@landing-components/Layout';
import { H2, Button, P, Link, variables } from '@trezor/components';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    font-size: ${variables.FONT_SIZE.NORMAL};
`;

const Item = styled.div``;

const ButtonAccess = styled(Button)`
    margin: 0 0 10px 0;
`;

const StyledP = styled(P)`
    margin: 10px 0;
    font-size: ${variables.FONT_SIZE.NORMAL};
`;

const ButtonWallet = styled(Button)`
    margin: 10px 0;
`;

const HeadBackP = styled(P)`
    display: flex;
    margin-top: 10px;
    font-size: ${variables.FONT_SIZE.NORMAL};
    flex-direction: column;
`;

const InfoRow = styled.div`
    display: flex;
    margin: 0 0 20px 0;
    flex-direction: column;
`;

const Line = styled.div`
    margin: 50px 0;
    border-top: 2px solid #ececec;
`;

const Index = () => (
    <Layout>
        <Wrapper>
            <H2>OneKey OneKey Desktop: Closed Beta</H2>
            <StyledP size="tiny">
                OneKey OneKey Desktop: Closed Beta is designated for experimental testing and the
                access is limited exclusively to our Beta Testers Community.
            </StyledP>
            <Item>
                <Link href="./wallet/start" target="_self" variant="nostyle">
                    <ButtonAccess variant="primary">Log in to OneKey OneKey Desktop</ButtonAccess>
                </Link>
            </Item>
            <Line />
            <H2>OneKey OneKey Desktop: Public Beta</H2>
            <HeadBackP size="tiny">
                <InfoRow>
                    OneKey OneKey Desktop is now available as public beta as well.
                    <Link href="https://onekey.so/download" target="_blank" variant="nostyle">
                        <ButtonWallet variant="secondary">Go to OneKey Desktop</ButtonWallet>
                    </Link>
                </InfoRow>
            </HeadBackP>
        </Wrapper>
    </Layout>
);

export default Index;
