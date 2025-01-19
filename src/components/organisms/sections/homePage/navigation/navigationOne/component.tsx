import ComposerComponent from "@organisms/composer/composerComponent"

type pageProps = {
    config: any,
    currentContainer: string,
    uid: any
}
function NavigationOneComponent(props: pageProps) {
    return (
        <ComposerComponent {...props} />
    )
}

export default NavigationOneComponent