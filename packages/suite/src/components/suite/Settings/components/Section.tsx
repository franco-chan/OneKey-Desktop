import React, { ReactNode, ReactElement } from 'react';
import styled from 'styled-components';
import Card from '@suite-components/Card';
import { variables, P } from '@trezor/components';

const Wrapper = styled.div`
    margin-bottom: 36px;
`;

const Header = styled.div`
    padding: 12px;
    margin-bottom: 4px;
`;

const Title = styled.div`
    font-size: ${variables.FONT_SIZE.TINY};
    color: ${props => props.theme.TYPE_DARK_GREY};
    text-transform: uppercase;
    font-weight: ${variables.FONT_WEIGHT.DEMI_BOLD};
`;

const Description = styled(P)`
    margin-top: 4px;
`;

const Content = styled(Card)`
    flex-direction: column;
    flex: 1;
    box-shadow: 0 1px 20px rgba(0, 0, 0, 0.05);
`;

interface Props {
    children: React.ReactNode;
    customHeader?: ReactNode | ReactElement;
    title?: string | ReactElement;
    description?: string | ReactElement;
}

const Section = ({ children, title, description, customHeader }: Props) => {
    return (
        <Wrapper>
            <Header>
                {!title && customHeader}
                {title && !customHeader && <Title>{title}</Title>}
                {description && !customHeader && (
                    <Description size="tiny">{description}</Description>
                )}
            </Header>
            <Content largePadding noVerticalPadding>
                {children}
            </Content>
        </Wrapper>
    );
};

export default Section;
