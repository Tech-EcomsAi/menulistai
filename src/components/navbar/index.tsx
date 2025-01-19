'use client';
import { APP_NAME } from '@constant/common';
import { NAVIGARIONS_ROUTINGS } from '@constant/navigations';
import { useAppDispatch } from '@hook/useAppDispatch';
import { useAppSelector } from '@hook/useAppSelector';
import { signOutSession } from '@lib/auth';
import { getDarkModeState, toggleDarkMode } from '@reduxSlices/clientThemeConfig';
import { showSuccessToast } from '@reduxSlices/toast';
import { Button, theme } from 'antd';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './navbar.module.scss';

function Navbar() {
    const router = useRouter();
    const { data: session } = useSession()
    const dispatch = useAppDispatch();
    const isDark = useAppSelector(getDarkModeState);
    const [usetData, setUsetData] = useState<any>(session?.user)
    const { token } = theme.useToken();

    useEffect(() => {
        setUsetData(session?.user)
    }, [session])

    const logoutUser = () => {
        signOutSession()
            .then(() => {
                dispatch(showSuccessToast("User logged out successfuly"))
            }).catch(() => {
                console.log("Error while singout firebase")
                dispatch(showSuccessToast("Something went wrong, try after some time"))
            })
    }

    return (
        <div className={styles.navbarWrap}>
            <Link href="/pricing">
                <div className={styles.loginAction} style={{ background: token.colorPrimary }}>
                    Pricing
                </div>
            </Link>
            <Link href="/dashboard">
                <div className={styles.loginAction} style={{ background: token.colorPrimary }}>
                    Dashboard
                </div>
            </Link>

            <Button onClick={() => dispatch(toggleDarkMode(!isDark))}>
                {isDark ? "Light" : "Dark"}
            </Button>

            <Button onClick={() => dispatch(showSuccessToast('Template saved successfuly'))}>
                Show toast
            </Button>

            <div className={styles.loginAction}>
                {usetData?.email}
                <div >{usetData?.name}</div>
                {usetData?.image && <div ><Image src={usetData?.image || ''} alt={APP_NAME} height={50} width={50} /></div>}
                {Boolean(usetData) ? <button onClick={logoutUser}>Logout</button> :
                    <button onClick={() => router.push(`/${NAVIGARIONS_ROUTINGS.SIGNIN}`)}>Login</button>}
                {/* <button onClick={() => signIn("email", { email: "pasaydandg@gmail.com" })}>Sign in with Email</button> */}
            </div>
        </div>
    )
}

export default Navbar