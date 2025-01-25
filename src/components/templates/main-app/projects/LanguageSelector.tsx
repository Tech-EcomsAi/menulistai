import { Flex, Tag, Typography, theme } from 'antd';
import { IoCheckmarkCircle } from "react-icons/io5";

const { Text } = Typography;

interface LanguageSelectorProps {
    allLanguages: Set<string>;
    selectedLanguages: Set<string>;
    onLanguageToggle: (language: string) => void;
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
            <Flex gap={8} wrap="wrap">
                {Array.from(allLanguages).map((lang, idx) => {
                    const isSelected = selectedLanguages.has(lang as string);
                    return (
                        <Tag
                            key={idx}
                            onClick={() => onLanguageToggle(lang as string)}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '16px',
                                fontSize: 12,
                                cursor: 'pointer',
                                background: isSelected ? token.colorPrimaryBg : token.colorBgContainer,
                                border: `1px solid ${isSelected ? token.colorPrimary : token.colorBorder}`,
                                color: isSelected ? token.colorPrimary : token.colorText,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                margin: '4px',
                                transition: 'all 0.3s'
                            }}
                        >
                            {isSelected && <IoCheckmarkCircle style={{ fontSize: 16 }} />}
                            {lang as string}
                        </Tag>
                    );
                })}
            </Flex>
        </Flex>
    );
}

export default LanguageSelector;
