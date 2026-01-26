Write-Host "Testing summarize-notes API..."
Start-Sleep 3

$headers = @{'Content-Type'='application/json'}
$body = @{
    notes = "Photosynthesis is the conversion of light energy to chemical energy. Light-dependent reactions occur in thylakoid membrane producing ATP and NADPH. Light-independent reactions (Calvin cycle) occur in stroma and fix CO2 into glucose."
    subject = "Biology"
    examType = "NEET"
} | ConvertTo-Json

Write-Host "Sending request to http://localhost:3000/api/summarize-notes"
Write-Host "Body: $body"

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/summarize-notes" `
        -Method POST `
        -Headers $headers `
        -Body $body `
        -TimeoutSec 30

    Write-Host "Status: $($response.StatusCode)"
    $data = $response.Content | ConvertFrom-Json
    Write-Host "Response:"
    Write-Host "  success: $($data.success)"
    Write-Host "  error: $($data.error)"
    if ($data.summary) {
        Write-Host "  summary length: $($data.summary.Length)"
        Write-Host "  first 300 chars: $($data.summary.Substring(0, [Math]::Min(300, $data.summary.Length)))"
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        Write-Host "Response Body: $($reader.ReadToEnd())"
        $reader.Dispose()
    }
}

Write-Host "`nDone!"
