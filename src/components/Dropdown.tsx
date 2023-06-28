import { styled } from "styled-components";

interface Props {
    options: string[];
}

const Dropdown = (props: Props) => {
    const { options } = props;
    return (
        <Wrapper>
            {options.map((option, index) => (
                <option key={index} value={option}>
                    {option}
                </option>
            ))}
        </Wrapper>
    );
};

export default Dropdown;

const Wrapper = styled.select`
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 322px;
    height: 25px;
    padding: 0 10px;

    &:focus {
        background-color: #ffffff;
    }
`;
