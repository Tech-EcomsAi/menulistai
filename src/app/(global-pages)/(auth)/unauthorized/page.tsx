'use client'
import { HOME_ROUTING, NAVIGARIONS_ROUTINGS } from '@constant/navigations';
import { Button, Flex, Result, Space, theme } from 'antd';
import { useRouter } from 'next/navigation';
import { BiSupport } from 'react-icons/bi';
import { LuHome, LuMail } from 'react-icons/lu';

function UnAuthorized() {
    const router = useRouter()
    const { token } = theme.useToken();

    return (
        <Flex vertical justify='center' align='center' style={{ background: token.colorBgBase, height: "100vh" }}>
            <Result
                status="403"
                title="403"
                subTitle={
                    <Flex vertical>
                        <h2>Sorry, you are not authorized to access this page.</h2>
                        <p>If you&apos;re supposed to have access, please make sure you&apos;re logged in with the correct account. For further assistance, reach out to our support team.</p>
                    </Flex>
                }
                extra={
                    <Space>
                        <Button icon={<BiSupport />} size='large'>Contact Us</Button>
                        <Button icon={<LuMail />} size='large' onClick={() => router.push(`/${NAVIGARIONS_ROUTINGS.SIGNIN}`)}>Sign-in with different email</Button>
                        <Button icon={<LuHome />} size='large' type="primary" onClick={() => router.push(`${HOME_ROUTING}`)}>Got to Home</Button>
                    </Space>
                }
            />
        </Flex>
    )
}

export default UnAuthorized