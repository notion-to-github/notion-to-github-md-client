import { keyframes, styled } from "styled-components";

interface Props {
    id: number;
    currentNumber: number;
    isDisabled?: boolean;
    isLast?: boolean;
    next: () => void;
    children: React.ReactNode;
}

const Card = (props: Props) => {
    const { id, currentNumber, isDisabled, isLast, next, children } = props;
    if (currentNumber < id) return <></>;
    return (
        <Wrapper>
            {children}
            {!isLast &&
                (currentNumber === id ? (
                    <NextButton onClick={next} disabled={isDisabled}>
                        ➡️
                    </NextButton>
                ) : (
                    <Check>✅</Check>
                ))}
        </Wrapper>
    );
};

export default Card;

const slideIn = keyframes`
  from {
    transform: translateX(-100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const Wrapper = styled.div`
    position: relative;
    width: 100%;
    min-width: 300px;
    margin-bottom: 30px;
    border: 1px solid #ced4da;
    border-radius: 5px;
    padding: 20px;
    animation: ${slideIn} 0.5s ease-in-out;
`;

const NextButton = styled.button`
    position: absolute;
    bottom: 0;
    right: 0;
    cursor: pointer;
    border: none;
    background-color: #ffffff;
    font-size: 20px;
`;

const Check = styled.div`
    position: absolute;
    bottom: -3px;
    right: 6px;
    font-size: 20px;
`;
