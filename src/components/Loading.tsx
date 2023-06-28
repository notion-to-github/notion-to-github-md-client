import styled, { keyframes } from "styled-components";

interface Props {
    big?: boolean;
}

const Loading = (props: Props) => {
    const { big } = props;

    return (
        <Wrapper>
            <Dot delay={0} big />
            <Dot delay={200} big />
            <Dot delay={400} big />
        </Wrapper>
    );
};

const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1.0); }
`;

interface DotProps {
    big?: boolean;
    delay: number;
}

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px;
`;

const Dot = styled.div<DotProps>`
    background-color: #333;
    border-radius: 50%;
    width: ${(props) => (props.big ? "20px" : "10px")};
    height: ${(props) => (props.big ? "20px" : "10px")};
    margin: 0 5px;
    animation: ${bounce} 1.4s infinite ease-in-out both;
    animation-delay: ${(props) => props.delay}ms;
`;

export default Loading;
