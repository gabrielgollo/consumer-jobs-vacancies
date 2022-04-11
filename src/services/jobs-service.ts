import { JobType, JobsServiceResponse } from "../types/utils-types";
import { JobsModel } from "../models/jobs-model"
import { getLogger } from "log4js";

const logger = getLogger()

export class JobsService{
    static async processJobs(jobs: JobType[]): Promise<JobsServiceResponse[]>{
        const processedJobs: JobsServiceResponse[] = [];
        for(const job of jobs){
            const jobResponse = await JobsService.saveJob(job);
            if(jobResponse.status === 'success'){
                logger.info(`[JobService] -- New Job Found -> ${jobResponse.data?.title}`)
            }
            processedJobs.push(jobResponse);
        }

        return processedJobs;

    }

    static async saveJob(job: JobType): Promise<JobsServiceResponse>{
        try {
            const { idJob, title, company } = job;
                const existJob = await JobsModel.getJobByIdAndCompany(idJob, company);
                if(existJob){
                    return {
                        status: 'fail',
                        data: job,
                        message: 'Job already exists'
                    }
                }

                await JobsModel.createOne(job);
                
                return {
                    status: 'success',
                    data: job,
                    message: `Job created -- ${title} -- ${company} -- ${idJob}`
                }
        } catch (error) {
            logger.error(error)
        }
        
        return {
            status: 'fail',
            data: job,
            message: 'Error creating job'
        }

    }
}