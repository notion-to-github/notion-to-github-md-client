import styled from "styled-components";

interface Props {
    width: string;
    color?: string;
}

const Divider = (props: Props) => {
    const { width, color } = props;
    return <_Divider width={width} color={color}></_Divider>;
};

export default Divider;

const _Divider = styled.hr<Props>`
    width: ${(props) => props.width};
    height: 1px;
    border: 0;
    background-color: ${(props) => {
        return props.color === undefined ? "#CED4DA" : props.color;
    }};
`;
