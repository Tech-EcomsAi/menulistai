import getActiveSession from "@lib/auth/getActiveSession";

export const apiCallComposerServer = async (fn, ...args) => {
    // console.log("apiCallComposerServer called:", args[args.length - 1])
    const session = await getActiveSession();
    if (!Boolean(session?.user)) return null;
    try {
        const response = await fn(...args);//actual api call
        return response;

    } catch (error) {
        console.error(`Error in API call: ${args[args.length - 1]}, ${error.message}`);
        return error;
        // You can handle the error here in a more specific way (optional)
        // throw error; // Re-throw the error if necessary
    }
}