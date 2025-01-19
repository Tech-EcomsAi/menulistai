import Saperator from '@atoms/Saperator';
import EditorWrapper from '@organisms/editor/editorWrapper';
import { Button, Typography, theme } from 'antd';
import { TbAlignCenter, TbAlignLeft, TbAlignRight } from 'react-icons/tb';
const { Text, Title } = Typography

function ContentAlignment({ value, onChange }) {
    const { token } = theme.useToken();

    const optionsList = [
        { value: 'flex-start', label: 'Left', icon: <TbAlignLeft /> },
        { value: 'center', label: 'Center', icon: <TbAlignCenter /> },
        { value: 'flex-end', label: 'Right', icon: <TbAlignRight /> },
    ]

    const onChangeValue = (value) => {
        onChange(value)
    }

    return (
        <>
            <EditorWrapper>
                <Text strong style={{ minWidth: 115 }}>Alighnment</Text>
                {optionsList.map((type: any, i: number) => {
                    return <Button
                        type="default"
                        block
                        key={i}
                        style={{ borderColor: type.value == value ? token.colorPrimary : token.colorBorder, color: type.value == value ? token.colorPrimary : token.colorTextBase }}
                        icon={type.icon}
                        onClick={() => onChangeValue(type.value)} />
                })}
            </EditorWrapper>
            <Saperator />
        </>
    )
}

export default ContentAlignment