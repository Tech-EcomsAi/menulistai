import AnimatedVerticalLogo from '@atoms/animatedVerticalLogo';
import styles from './page.module.css';

function ServerSidePageLoader({ page }) {

    console.log("Loader source: ", page)
    return (
        <main className={styles.loadingWrap} data-loader-source={`server-loader-${page}`}>
            <AnimatedVerticalLogo />
            {/* <div data-loader-source={page} className={styles.bgWrap}></div> */}
        </main>
    )
}

export default ServerSidePageLoader