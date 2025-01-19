import { ADMIN_NAVIGARIONS_ROUTINGS } from "@constant/navigations";
import { getApplicationLogById } from "@database/loggers/applicationLogger";
import { getErrorLogById } from "@database/loggers/errorLogger";
import LogsDetails from "@template/platform/logger/logsDetails";
import { redirect } from 'next/navigation';

async function page({ params }) {
    console.log("params", params)
    let logDetails = null;
    if (params.type == "application") {
        logDetails = await getApplicationLogById(params.logId)
    } else {
        logDetails = await getErrorLogById(params.logId)
    }
    if (!logDetails) {
        redirect(`${ADMIN_NAVIGARIONS_ROUTINGS.ROOT}/${ADMIN_NAVIGARIONS_ROUTINGS.LOGS}`)
    }
    return (
        <LogsDetails logDetails={logDetails} />
    )
}

export default page