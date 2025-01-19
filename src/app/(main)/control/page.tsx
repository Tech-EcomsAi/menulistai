import { Suspense } from 'react'
import ServerSidePageLoader from 'src/app/loading'

function page() {
    return (
        <Suspense fallback={<ServerSidePageLoader page={"Home"} />}>
            Home
        </Suspense>
    )
}

export default page