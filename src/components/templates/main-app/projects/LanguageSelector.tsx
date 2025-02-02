import { Flex, Tag, Typography, message, theme } from 'antd';

const { Text } = Typography;

interface LanguageSelectorProps {
    allLanguages: string[];
    selectedLanguages: string[];
    onLanguageToggle: (updatedLanguages: string[]) => void;
    title?: string;
    description?: string;
    style?: React.CSSProperties;
}

export function LanguageSelector({
    allLanguages,
    selectedLanguages,
    onLanguageToggle,
    title = "",
    description = "",
    style
}: LanguageSelectorProps) {
    const { token } = theme.useToken();

    return (
        <Flex vertical style={{ ...style }}>
            {title && <Text strong>{title}</Text>}
            {description && <Text type="secondary" style={{ marginBottom: 8 }}>{description}</Text>}
            <Flex gap={6} wrap="wrap">
                {allLanguages.map((lang, idx) => {
                    const isSelected = selectedLanguages.includes(lang);
                    return (
                        <Tag
                            key={idx}
                            onClick={() => {
                                const newSelected = [...selectedLanguages];
                                const langIndex = newSelected.indexOf(lang);
                                if (langIndex > -1) {
                                    if (newSelected.length <= 1) {
                                        message.warning('At least one language must remain selected');
                                        return;
                                    }
                                    newSelected.splice(langIndex, 1);
                                } else {
                                    newSelected.push(lang);
                                }
                                onLanguageToggle(newSelected);
                            }}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '16px',
                                fontSize: 12,
                                cursor: 'pointer',
                                background: isSelected ? token.colorPrimaryBg : token.colorBgContainer,
                                border: `1px solid ${isSelected ? token.colorPrimaryBorder : token.colorBorder}`,
                                color: isSelected ? token.colorPrimary : token.colorText,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                margin: '0px',
                                transition: 'all 0.3s'
                            }}
                        >
                            {/* {isSelected && <IoCheckmarkCircle style={{ fontSize: 16 }} />} */}
                            {lang as string}
                        </Tag>
                    );
                })}
            </Flex>
        </Flex>
    );
}

export default LanguageSelector;
