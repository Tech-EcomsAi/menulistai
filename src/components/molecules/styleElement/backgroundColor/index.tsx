import ColorStyle from '../color';

function BackgroundColor({ value, onChange }: any) {

    return (
        <ColorStyle value={value} onChange={onChange} />
    )
}

export default BackgroundColor