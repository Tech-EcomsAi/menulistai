import GenericDashboard from '@template/genericDashboard'
import { Suspense } from 'react'
import ServerSidePageLoader from 'src/app/loading'

function page() {
    return (
        <Suspense fallback={<ServerSidePageLoader page={"Home"} />}>
            <GenericDashboard />
        </Suspense>
    )
}

export default page