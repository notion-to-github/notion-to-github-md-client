export type ImageStorage = "github" | "aws_s3";
export type Notification = "none" | "slack";

export interface Config {
    notion: {
        api_key: string | null;
        database_id: string | null;
    };
    github: {
        repository: string | null;
        directory: string | null;
    };
    image: {
        storage: ImageStorage;
        aws_s3?: {
            api_key: string | null;
        };
    };
    notification: Notification;
}
