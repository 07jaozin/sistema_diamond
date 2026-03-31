import boto3
from flask import current_app
import re


class StorageService:

    def __init__(self):
        self.client = boto3.client(
            "s3",
            aws_access_key_id=current_app.config["AWS_ACCESS_KEY_ID"],
            aws_secret_access_key=current_app.config["AWS_SECRET_ACCESS_KEY"],
            region_name=current_app.config["AWS_REGION"],
            endpoint_url=f"https://s3.{current_app.config['AWS_REGION']}.amazonaws.com")
        
        self.bucket = current_app.config["AWS_BUCKET"]

    @staticmethod
    def sanitize_filename(filename):
      
        filename = re.sub(r'[^a-zA-Z0-9_.-]', '_', filename)
        return filename

    def upload_file(self, file_bytes, filename):
        if not filename:
            raise ValueError("Filename é obrigatório")
        
        filename = StorageService.sanitize_filename(filename)

        key = f"os/{filename}"

        self.client.put_object(
            Bucket=self.bucket,
            Key=key,
            Body=file_bytes,
            ContentType="application/pdf"
        )

        return key

    def generate_url(self, key, expires=3600):
 
        return self.client.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": self.bucket,
                "Key": key
            },
            ExpiresIn=expires
        )

    def upload_and_get_url(self, file_bytes, filename, expires=3600):
        
        key = self.upload_file(file_bytes, filename)
        url = self.generate_url(key, expires)
        return url