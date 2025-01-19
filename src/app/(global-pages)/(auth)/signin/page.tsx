import LoginPage from '@template/loginPage'
import React, { Suspense } from 'react'
import ServerSidePageLoader from 'src/app/loading'

function page() {
    return <React.Fragment>
        <Suspense fallback={<ServerSidePageLoader page={'Login'} />}>
            <LoginPage />
        </Suspense>
    </React.Fragment>
}

export default page