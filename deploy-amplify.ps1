$ErrorActionPreference = "Stop"

Write-Host "Zipping dist..."
python -c "
import zipfile, os
with zipfile.ZipFile('frontend-dist.zip', 'w', zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk('frontend/dist'):
        for file in files:
            fp = os.path.join(root, file)
            zf.write(fp, os.path.relpath(fp, 'frontend/dist'))
print('Done')
"

Write-Host "Stopping any pending jobs..."
$jobs = (aws amplify list-jobs --app-id dp9o6ky8o6o1b --branch-name main --region ap-south-1) -join "" | ConvertFrom-Json
foreach ($job in $jobs.jobSummaries) {
    if ($job.status -eq "PENDING" -or $job.status -eq "RUNNING") {
        aws amplify stop-job --app-id dp9o6ky8o6o1b --branch-name main --job-id $job.jobId --region ap-south-1 | Out-Null
        Start-Sleep -Seconds 3
    }
}

Write-Host "Creating deployment..."
$deployJson = (aws amplify create-deployment --app-id dp9o6ky8o6o1b --branch-name main --region ap-south-1) -join ""
$deploy = $deployJson | ConvertFrom-Json
$jobId = $deploy.jobId
$url = $deploy.zipUploadUrl
Write-Host "Job: $jobId"

Write-Host "Uploading..."
Invoke-WebRequest -Uri $url -Method PUT -InFile "frontend-dist.zip" -ContentType "application/zip" -UseBasicParsing | Out-Null
Write-Host "Uploaded."

Write-Host "Starting deployment..."
aws amplify start-deployment --app-id dp9o6ky8o6o1b --branch-name main --job-id $jobId --region ap-south-1 | Out-Null

Write-Host "Waiting..."
for ($i = 0; $i -lt 24; $i++) {
    Start-Sleep -Seconds 10
    $status = ((aws amplify get-job --app-id dp9o6ky8o6o1b --branch-name main --job-id $jobId --region ap-south-1) -join "" | ConvertFrom-Json).job.summary.status
    Write-Host "  $status"
    if ($status -eq "SUCCEED") {
        Write-Host ""
        Write-Host "LIVE: https://main.dp9o6ky8o6o1b.amplifyapp.com"
        break
    }
    if ($status -eq "FAILED" -or $status -eq "CANCELLED") { Write-Host "Deploy $status"; break }
}
Remove-Item frontend-dist.zip -ErrorAction SilentlyContinue
