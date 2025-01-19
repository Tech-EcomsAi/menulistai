import ForgotPasswordPage from '@template/forgotPassword'
import React, { Suspense } from 'react'
import ServerSidePageLoader from 'src/app/loading'

function page() {
    return <React.Fragment>
        <Suspense fallback={<ServerSidePageLoader page={'Forgot Password'} />}>
            <ForgotPasswordPage />
        </Suspense>
    </React.Fragment>
}

export default page