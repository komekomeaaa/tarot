import boto3

BUCKET_NAME = 'tarot-app-698109621952'

s3 = boto3.resource('s3')
bucket = s3.Bucket(BUCKET_NAME)

print(f"Emptying bucket {BUCKET_NAME}...")

# Delete all object versions
print("Deleting object versions...")
bucket.object_versions.delete()

# Delete specific delete markers if any remain (usually covered above, but safe to verify)
# Note: bucket.object_versions.delete() usually handles everything including delete markers.

print("Bucket emptied.")
