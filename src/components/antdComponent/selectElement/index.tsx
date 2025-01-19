import { Select } from 'antd'

function SelectElement({ value, styles = {}, onChange, options, isBordered = true }) {
    return (
        <Select
            defaultValue={value}
            value={value}
            bordered={isBordered}
            style={{ width: "100%", ...styles }}
            // style={{ width: 'auto' }}
            onChange={onChange}
            options={options}
        />
    )
}

export default SelectElement