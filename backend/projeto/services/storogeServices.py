import boto3
from flask import current_app


class StorageService:

    def __init__(self):
        self.client = boto3.client(
            "s3",
            aws_access_key_id=current_app.config["AWS_ACCESS_KEY"],
            aws_secret_access_key=current_app.config["AWS_SECRET_KEY"],
            region_name=current_app.config["AWS_REGION"]
        )
        self.bucket = current_app.config["AWS_BUCKET"]

    def generate_url(self, key, expires=300):
        return self.client.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": self.bucket,
                "Key": key
            },
            ExpiresIn=expires
        )