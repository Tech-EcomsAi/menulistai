import getActiveSession from "@lib/auth/getActiveSession";
import { startLoader, stopLoader } from "@reduxSlices/loader";
import { showErrorToast } from "@reduxSlices/toast";
import { reduxStore } from "@reduxStore/index";

export const apiCallComposerClient = async (fn, ...args) => {
    console.log("apiCallComposerClient called:", args)
    const isPublicApi = args[args.length - 1]
    const session = await getActiveSession();
    if (!Boolean(session?.user) && !isPublicApi) {
        reduxStore.dispatch(showErrorToast("User not logged in"));
        return null;
    }

    const requestId = `${args[0]}_${Date.now()}`;
    try {
        reduxStore.dispatch(startLoader(requestId))
        const response = await fn(...args);
        reduxStore.dispatch(stopLoader(requestId))
        return response;
    } catch (error) {
        console.error(`Error in API call: ${args[args.length - 1]}, ${error.message}`);
        reduxStore.dispatch(stopLoader(requestId))
        return error;
        // You can handle the error here in a more specific way (optional)
        // throw error; // Re-throw the error if necessary
    }
}