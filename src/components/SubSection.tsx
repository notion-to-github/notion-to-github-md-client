import { styled } from 'styled-components';

interface Props {
    title: string;
    description?: string;
    necessary?: boolean;
    children: React.ReactNode;
}

const SubSection = (props: Props) => {
    const { title, description, necessary, children } = props;
    return (
        <Wrapper>
            <TitleWrapper>
                <Title>{title}</Title>
                {necessary && <Necessary>*</Necessary>}
            </TitleWrapper>
            {children}
            <Description>{description}</Description>
        </Wrapper>
    );
};

export default SubSection;

const Wrapper = styled.div`
    margin-bottom: 10px;
`;

const TitleWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const Title = styled.div`
    font-size: 16px;
    width: fit-content;
    font-weight: bold;
`;

const Description = styled.div`
    font-size: 12px;
    color: #868e96;
    margin-top: 10px;
`;

const Necessary = styled.div`
    display: flex;
    align-items: center;
    text-align: center;
    color: red;
    margin-left: 5px;
`;
