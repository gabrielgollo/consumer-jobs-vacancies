export interface JobType {
    title: string;
    location: string;
    link: string;
    isRemoteJob: boolean;
    idJob: string;
    company: string;
    description: string | null;
}


export interface JobsServiceResponse {
    status: 'success' | 'fail';
    message: string;
    data?: JobType;
}

export interface onGetResponse {
    status: 'success' | 'fail';
    message: string;
    JobsResponse?: JobsServiceResponse[];
}