import Saperator from '@atoms/Saperator';
import EditorWrapper from '@organisms/editor/editorWrapper';
import { Select, Typography } from 'antd';
const { Text } = Typography

function ObjectFit({ onChange, value }) {

    const optionsList = [
        { label: 'Fill', value: 'fill' },
        { label: 'Contain', value: 'contain' },
        { label: 'Cover', value: 'cover' },
        { label: 'Scale Down', value: 'scale-down' },
        { label: 'None', value: 'none' },
    ]

    const onChangeValue = (value) => {
        onChange('objectFit', value)
    }
    return (
        <EditorWrapper>
            <Text strong>Fill</Text>
            <Select
                showSearch
                value={value}
                style={{ width: '100%' }}
                onChange={(value) => onChangeValue(value)}
                options={optionsList}
            />
            <Saperator />
        </EditorWrapper>
    )
}

export default ObjectFit