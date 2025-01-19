import { CRAFT_BUILDER_MAINTAINER_USER_ROLE } from "@constant/user";
import getActiveSession from "@lib/auth/getActiveSession";
import { redirect } from "next/navigation";

const WithLayout = async ({ children }) => {

    const session = await getActiveSession();
    if (session?.platformRole == CRAFT_BUILDER_MAINTAINER_USER_ROLE) {
        redirect("/craft-builder")
    }

    return (
        <>
            {children}
        </>
    )
}

export default WithLayout