import styled from 'styled-components';
import Divider from './Divider';

interface Props {
    title: string;
    children: React.ReactNode;
}

const Section = (props: Props) => {
    const { title, children } = props;
    return (
        <Wrapper>
            <Title>{title}</Title>
            <Divider width="auto" />
            {children}
        </Wrapper>
    );
};

export default Section;

const Wrapper = styled.div`
    width: 380px;
    margin-bottom: 30px;
`;

const Title = styled.h2`
    font-size: 22px;
`;
