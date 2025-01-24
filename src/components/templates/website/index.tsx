'use client';

import { Button, Card, Col, Row, Space, theme, Typography } from 'antd';
import { AiOutlineGlobal } from 'react-icons/ai';
import { BiBrain, BiImage, BiRestaurant, BiSupport } from 'react-icons/bi';
import { FaRobot } from 'react-icons/fa';
import { MdOutlineAutoGraph, MdOutlineIntegrationInstructions } from 'react-icons/md';
import GetStartedButton from './getStartedButton';
import styles from './website.module.scss';

const { Title, Paragraph, Text } = Typography;
const { useToken } = theme;

function Website() {
    const { token } = useToken();

    const features = [
        {
            icon: <BiBrain style={{ fontSize: 24, color: token.colorPrimary }} />,
            title: "Smart Extraction",
            description: "Advanced OCR and AI algorithms automatically extract menu data with high accuracy from images and PDFs."
        },
        {
            icon: <BiRestaurant style={{ fontSize: 24, color: token.colorPrimary }} />,
            title: "Menu Intelligence",
            description: "Automatically categorize and structure menu items, prices, and descriptions into a standardized format."
        },
        {
            icon: <MdOutlineAutoGraph style={{ fontSize: 24, color: token.colorPrimary }} />,
            title: "Data Validation",
            description: "AI-powered validation ensures accuracy and consistency across all extracted menu data."
        },
        {
            icon: <BiSupport style={{ fontSize: 24, color: token.colorPrimary }} />,
            title: "24/7 Support",
            description: "Our dedicated support team is always available to help you with any questions or issues."
        },
        {
            icon: <AiOutlineGlobal style={{ fontSize: 24, color: token.colorPrimary }} />,
            title: "Multi-Language",
            description: "Support for multiple languages and automatic language detection for global menu management."
        },
        {
            icon: <MdOutlineIntegrationInstructions style={{ fontSize: 24, color: token.colorPrimary }} />,
            title: "Easy Integration",
            description: "Seamlessly integrate with your existing POS, website, or management systems."
        }
    ];

    const steps = [
        {
            title: "Upload Your Menu",
            description: "Simply upload your menu in any format - image or PDF. Support for multiple file types including JPG, PNG, and PDF."
        },
        {
            title: "AI Processing",
            description: "Our AI engine automatically extracts and structures your menu data, categorizing items and validating information."
        },
        {
            title: "Review & Export",
            description: "Review the structured data, make any necessary adjustments, and export to your preferred format or system."
        }
    ];

    return (
        <div className={styles.websiteContainer} style={{ background: token.colorBgBase }}>
            <div className={styles.hero}>
                <Row gutter={[48, 48]} align="middle">
                    <Col xs={24} lg={12}>
                        <Title className={styles.mainTitle} style={{ fontSize: 48, marginBottom: token.marginLG }}>
                            Transform Your Menu Management to Autopilot
                        </Title>
                        <Title level={2} style={{ fontSize: 24, marginBottom: token.marginXL }}>
                            Extract, Structure, and Manage Your Menu Data Automatically
                        </Title>
                        <Space direction="vertical" size="large" style={{ marginBottom: token.marginXL }}>
                            <Space>
                                <BiImage style={{ fontSize: 20, color: token.colorPrimary }} />
                                <Text>Intelligent OCR & Text Extraction</Text>
                            </Space>
                            <Space>
                                <FaRobot style={{ fontSize: 20, color: token.colorPrimary }} />
                                <Text>AI-Powered Data Structuring</Text>
                            </Space>
                            <Space>
                                <AiOutlineGlobal style={{ fontSize: 20, color: token.colorPrimary }} />
                                <Text>Multi-Language Support</Text>
                            </Space>
                        </Space>
                        <Space size="large">
                            <GetStartedButton />
                            <Button type="link" size="large">Watch Demo</Button>
                        </Space>
                    </Col>
                    <Col xs={24} lg={12}>
                        <img
                            src="https://placehold.co/800x600/ffffff/808080/png?text=MenuListAI+Dashboard"
                            alt="MenuListAI Dashboard"
                            style={{ width: '100%', borderRadius: token.borderRadiusLG }}
                        />
                    </Col>
                </Row>
            </div>

            <div className={styles.trustedBy}>
                <Text type="secondary" style={{ display: 'block', marginBottom: token.marginLG }}>
                    Trusted by restaurants worldwide
                </Text>
                <Row gutter={[32, 32]} justify="center" align="middle">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Col key={i}>
                            <img
                                src={`https://placehold.co/120x40/ffffff/808080/png?text=Restaurant+${i}`}
                                alt={`Restaurant ${i}`}
                                style={{ opacity: 0.7 }}
                            />
                        </Col>
                    ))}
                </Row>
            </div>

            <div className={styles.features}>
                <Title style={{ textAlign: 'center', marginBottom: token.marginXXL }}>
                    Everything you need to manage your menu data
                </Title>
                <Row gutter={[32, 32]}>
                    {features.map((feature, index) => (
                        <Col xs={24} sm={12} lg={8} key={index}>
                            <Card bordered hoverable>
                                <Space direction="vertical" size="large">
                                    {feature.icon}
                                    <Title level={4}>{feature.title}</Title>
                                    <Paragraph type="secondary">{feature.description}</Paragraph>
                                </Space>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            <div className={styles.workflow}>
                <Title style={{ textAlign: 'center', marginBottom: token.marginXXL }}>
                    How it works
                </Title>
                <Row gutter={[48, 48]}>
                    {steps.map((step, index) => (
                        <Col xs={24} md={8} key={index}>
                            <Space direction="vertical" size="large">
                                <Text style={{ fontSize: 48, color: token.colorPrimary, opacity: 0.2 }}>
                                    {String(index + 1).padStart(2, '0')}
                                </Text>
                                <Title level={3}>{step.title}</Title>
                                <Paragraph type="secondary">{step.description}</Paragraph>
                            </Space>
                        </Col>
                    ))}
                </Row>
            </div>

            <div className={styles.cta}>
                <Title style={{ marginBottom: token.marginLG }}>
                    Ready to Automate Your Menu Management?
                </Title>
                <Paragraph style={{ fontSize: 18, marginBottom: token.marginXL }}>
                    Join leading restaurants using MenuListAI to streamline their operations
                </Paragraph>
                <Space size="large">
                    <Button type="primary" size="large" href="/signin">
                        Start Free Trial
                    </Button>
                    <Button size="large">Schedule Demo</Button>
                </Space>
            </div>
        </div>
    );
}

export default Website;