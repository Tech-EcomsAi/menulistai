'use client'
import { HOME_ROUTING } from '@constant/navigations';
import { Button, Flex, Result, Space, theme } from 'antd';
import { useRouter } from 'next/navigation';
import { LuArrowLeft, LuHome } from 'react-icons/lu';

function NotFound() {
    const router = useRouter()
    const { token } = theme.useToken();
    return (
        <Flex vertical justify='center' align='center' style={{ background: token.colorBgBase, height: "calc(100vh - 72px)" }}>
            <Result
                status="404"
                title="404"
                subTitle={
                    <Flex vertical>
                        <h2>We can&apos;t find that page</h2>
                        <p>We&apos;re fairly sure that page used to be here, but seems to have gone missing. We do apologise on it&apos;s behalf.</p>
                    </Flex>
                }
                extra={
                    <Space>
                        <Button icon={<LuArrowLeft />} size='large' onClick={() => router.back()}>Go Back</Button>
                        <Button icon={<LuHome />} size='large' type="primary" onClick={() => router.push(HOME_ROUTING)}>Go to home</Button>
                    </Space>
                }
            />
        </Flex>
    )
}

export default NotFound