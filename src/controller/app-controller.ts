import { JobType, onGetResponse } from "../types/utils-types";

import { JobsService } from "../services/jobs-service";

export class AppController{
    static async onGet(message: JobType[]): Promise<onGetResponse>{
        
        try{
            const processedJobs = await JobsService.processJobs(message);

            return {
                status: 'success',
                message: 'Jobs processed',
                JobsResponse: processedJobs
            }

        } catch (error){
            return {
                status: 'fail',
                message: String(error)
            }
        }
    }
}