Write-Host "🚀 CMS Testing" -ForegroundColor Green
$baseUrl = "http://localhost:3000"
$tests = @(
    @{Name="Analytics"; Url="$baseUrl/api/admin/analytics/"},
    @{Name="Search Stats"; Url="$baseUrl/api/admin/search/?stats=true"},
    @{Name="Search Query"; Url="$baseUrl/api/admin/search/?q=fisika"},
    @{Name="Audit Logs"; Url="$baseUrl/api/admin/audit/"},
    @{Name="Sessions"; Url="$baseUrl/api/admin/collaboration/?action=sessions"},
    @{Name="Schedule"; Url="$baseUrl/api/admin/schedule/?upcoming=true"},
    @{Name="Dashboard"; Url="$baseUrl/api/admin/dashboard/"}
)

$passed = 0
$failed = 0

foreach ($test in $tests) {
    try {
        Write-Host "Testing $($test.Name)..." -ForegroundColor Yellow
        $response = Invoke-WebRequest -Uri $test.Url -Method GET
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ PASSED" -ForegroundColor Green
            $passed++
        } else {
            Write-Host "❌ FAILED - Status: $($response.StatusCode)" -ForegroundColor Red
            $failed++
        }
    }
    catch {
        Write-Host "❌ FAILED - Error: $($_.Exception.Message)" -ForegroundColor Red
        $failed++
    }
}

Write-Host "`n✅ Passed: $passed" -ForegroundColor Green
Write-Host "❌ Failed: $failed" -ForegroundColor Red
