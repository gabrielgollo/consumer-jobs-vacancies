import mongoose from "mongoose";
import { mongoDb } from "../database/mongodb";
import { JobSchema } from "../schemas/job-schema";
import { JobType } from "../types/utils-types";

const connection: mongoose.Connection = mongoDb.getOrCreateConnection();

const Model = connection.model('job', JobSchema, 'jobsVacancies');

export class JobsModel{
    static createOne(job: JobType){
        return Model.create(job);
    }

    static getJobByIdAndCompany(idJob: string, company: string){
        return  Model.findOne({ idJob: idJob, company: company })
    }
}
