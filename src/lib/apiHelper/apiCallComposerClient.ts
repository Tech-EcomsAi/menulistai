import getActiveSession from "@lib/auth/getActiveSession";
import { toggleLoader } from "@reduxSlices/loader";
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
    try {
        reduxStore.dispatch(toggleLoader(`apiCallComposerClient:${args[0]}`))//before api call
        const response = await fn(...args);//actual api call
        reduxStore.dispatch(toggleLoader(false))//after api call
        return response;

    } catch (error) {

        console.error(`Error in API call: ${args[args.length - 1]}, ${error.message}`);
        reduxStore.dispatch(toggleLoader(false))
        return error;
        // You can handle the error here in a more specific way (optional)
        // throw error; // Re-throw the error if necessary
    }
}