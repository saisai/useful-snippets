order-management-system

[admin@oms.local](mailto:admin@oms.local) 
DevAdmin123!

```
npm install
```

```
npx tsc --noEmit; npx next lint
```

```
gofmt -w ./internal/config; go test ./internal/config
```

```
Get-ChildItem -Name; if (Test-Path pgsql) { Get-ChildItem pgsql | Select-Object Name, Mode }; if (Test-Path pgsql\bin) { Get-ChildItem pgsql\bin -Filter "pg_*.exe" | Select-Object Name }; if (Test-Path .devlogs) { Get-ChildItem .devlogs | Select-Object Name, Length, LastWriteTime }
```

```
Get-ChildItem -Name; if (Test-Path pgsql) { Get-ChildItem pgsql | Select-Object Name, Mode }; if (Test-Path pgsql\bin) { Get-ChildItem pgsql\bin -Filter "pg_*.exe" | Select-Object Name }; if (Test-Path .devlogs) { Get-ChildItem .devlogs | Select-Object Name, Length, LastWriteTime }
```

```
Write-Host "pgsql exists:" (Test-Path "pgsql"); Write-Host "pgsql\bin exists:" (Test-Path "pgsql\bin"); Write-Host "pg_ctl:" (Test-Path "pgsql\bin\pg_ctl.exe"); Get-ChildItem "pgsql" -Force | Format-Table Name, Mode, Length -AutoSize; if (Test-Path "pgsql\bin") { Get-ChildItem "pgsql\bin\pg_ctl.exe","pgsql\bin\pg_isready.exe","pgsql\bin\psql.exe","pgsql\bin\initdb.exe" -ErrorAction SilentlyContinue | Format-Table FullName, Length -AutoSize }; Write-Host "--- logs ---"; if (Test-Path ".devlogs") { Get-ChildItem ".devlogs" -Force | Format-Table Name, Length -AutoSize; Get-ChildItem ".devlogs" -Filter "*.log" | ForEach-Object { Write-Host "==== $($_.Name) ===="; Get-Content $_.FullName -ErrorAction SilentlyContinue } }
```

```
$root = (Get-Location).Path
$pgCtl = Join-Path $root "pgsql\bin\pg_ctl.exe"
$pgData = Join-Path $root "pgsql\data"
$pgLog = Join-Path $root "pgsql\logfile"
$pgIsReady = Join-Path $root "pgsql\bin\pg_isready.exe"

Write-Host "pgCtl=$pgCtl"
Write-Host "pgData=$pgData"
Write-Host "pgLog=$pgLog"

$command = "`"$pgCtl`" -D `"$pgData`" -l `"$pgLog`" start"
Write-Host "COMMAND=$command"

# Show how Start-Process would quote it by using ProcessStartInfo
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = "cmd.exe"
$psi.Arguments = "/c $command"
Write-Host "PSI.Arguments=$($psi.Arguments)"

Write-Host "--- postgres processes ---"
Get-Process postgres,pg_ctl -ErrorAction SilentlyContinue | Format-Table Id, ProcessName, StartTime -AutoSize
Write-Host "--- port 5432 ---"
$tcp = New-Object System.Net.Sockets.TcpClient
try { $task = $tcp.ConnectAsync("127.0.0.1", 5432); Write-Host ("connected=" + ($task.Wait(400) -and $tcp.Connected)) } catch { Write-Host $_ } finally { $tcp.Close() }

Write-Host "--- pg_ctl status via Start-Process no cmd ---"
$statusOut = Join-Path $root ".devlogs\status.out.log"
$statusErr = Join-Path $root ".devlogs\status.err.log"
Remove-Item $statusOut,$statusErr -ErrorAction SilentlyContinue
$p = Start-Process -FilePath $pgCtl -ArgumentList @("-D", $pgData, "status") -Wait -PassThru -WindowStyle Hidden -RedirectStandardOutput $statusOut -RedirectStandardError $statusErr
Write-Host "status exit=$($p.ExitCode)"
Write-Host "OUT:"; Get-Content $statusOut -ErrorAction SilentlyContinue
Write-Host "ERR:"; Get-Content $statusErr -ErrorAction SilentlyContinue

```

```
$root = (Get-Location).Path
$pgCtl = Join-Path $root "pgsql\bin\pg_ctl.exe"
$pgData = Join-Path $root "pgsql\data"
$pgLog = Join-Path $root "pgsql\logfile"
$logDir = Join-Path $root ".devlogs"
$outLog = Join-Path $logDir "repro.out.log"
$errLog = Join-Path $logDir "repro.err.log"

$command = "`"$pgCtl`" -D `"$pgData`" -l `"$pgLog`" start"
Write-Host "Trying current Invoke-Cmd style..."
Remove-Item $outLog,$errLog -ErrorAction SilentlyContinue
$p = Start-Process -FilePath "cmd.exe" -ArgumentList @("/c", $command) -Wait -PassThru -WindowStyle Hidden -RedirectStandardOutput $outLog -RedirectStandardError $errLog
Write-Host "exit=$($p.ExitCode)"
Write-Host "OUT:"; Get-Content $outLog -Raw -ErrorAction SilentlyContinue
Write-Host "ERR:"; Get-Content $errLog -Raw -ErrorAction SilentlyContinue

Write-Host "`nTrying cmd /c with extra quotes wrapper..."
Remove-Item $outLog,$errLog -ErrorAction SilentlyContinue
$wrapped = "/c `"$command`""
Write-Host "args=$wrapped"
$p2 = Start-Process -FilePath "cmd.exe" -ArgumentList $wrapped -Wait -PassThru -WindowStyle Hidden -RedirectStandardOutput $outLog -RedirectStandardError $errLog
Write-Host "exit=$($p2.ExitCode)"
Write-Host "OUT:"; Get-Content $outLog -Raw -ErrorAction SilentlyContinue
Write-Host "ERR:"; Get-Content $errLog -Raw -ErrorAction SilentlyContinue
```

```
Get-Process postgres,pg_ctl,cmd -ErrorAction SilentlyContinue | Format-Table Id, ProcessName, StartTime -AutoSize; Get-Content "pgsql\logfile" -Tail 30
```

```
# Stop the hung cmd.exe that is waiting on redirected pg_ctl
Stop-Process -Id 30284 -Force -ErrorAction SilentlyContinue
# Stop leftover cmd from earlier make if it's still our test/dev wrapper
Get-CimInstance Win32_Process | Where-Object { $_.ProcessId -eq 18700 } | Select-Object ProcessId, CommandLine | Format-List

$root = (Get-Location).Path
$pgCtl = Join-Path $root "pgsql\bin\pg_ctl.exe"
$pgData = Join-Path $root "pgsql\data"
$pgLog = Join-Path $root "pgsql\logfile"
$pgIsReady = Join-Path $root "pgsql\bin\pg_isready.exe"

Write-Host "=== stopping postgres ==="
$stop = Start-Process -FilePath $pgCtl -ArgumentList @("-D", $pgData, "-w", "stop") -Wait -PassThru -WindowStyle Hidden
Write-Host "stop exit=$($stop.ExitCode)"
Start-Sleep -Seconds 1
Write-Host "postgres procs:"; Get-Process postgres -ErrorAction SilentlyContinue | Format-Table Id, ProcessName

Write-Host "=== starting postgres without redirect ==="
$sw = [Diagnostics.Stopwatch]::StartNew()
$start = Start-Process -FilePath $pgCtl -ArgumentList @("-D", $pgData, "-l", $pgLog, "-w", "start") -Wait -PassThru -WindowStyle Hidden
$sw.Stop()
Write-Host "start exit=$($start.ExitCode) elapsed_ms=$($sw.ElapsedMilliseconds)"

Write-Host "=== pg_isready via direct Start-Process with redirect ==="
$outLog = Join-Path $root ".devlogs\ready.out.log"
$errLog = Join-Path $root ".devlogs\ready.err.log"
Remove-Item $outLog,$errLog -ErrorAction SilentlyContinue
$ready = Start-Process -FilePath $pgIsReady -ArgumentList @("-h","127.0.0.1","-p","5432","-U","postgres","-d","postgres") -Wait -PassThru -WindowStyle Hidden -RedirectStandardOutput $outLog -RedirectStandardError $errLog
Write-Host "ready exit=$($ready.ExitCode)"
Write-Host "OUT:"; Get-Content $outLog -ErrorAction SilentlyContinue
Write-Host "ERR:"; Get-Content $errLog -ErrorAction SilentlyContinue

```

```
# Stop the hung cmd.exe that is waiting on redirected pg_ctl
Stop-Process -Id 30284 -Force -ErrorAction SilentlyContinue
# Stop leftover cmd from earlier make if it's still our test/dev wrapper
Get-CimInstance Win32_Process | Where-Object { $_.ProcessId -eq 18700 } | Select-Object ProcessId, CommandLine | Format-List

$root = (Get-Location).Path
$pgCtl = Join-Path $root "pgsql\bin\pg_ctl.exe"
$pgData = Join-Path $root "pgsql\data"
$pgLog = Join-Path $root "pgsql\logfile"
$pgIsReady = Join-Path $root "pgsql\bin\pg_isready.exe"

Write-Host "=== stopping postgres ==="
$stop = Start-Process -FilePath $pgCtl -ArgumentList @("-D", $pgData, "-w", "stop") -Wait -PassThru -WindowStyle Hidden
Write-Host "stop exit=$($stop.ExitCode)"
Start-Sleep -Seconds 1
Write-Host "postgres procs:"; Get-Process postgres -ErrorAction SilentlyContinue | Format-Table Id, ProcessName

Write-Host "=== starting postgres without redirect ==="
$sw = [Diagnostics.Stopwatch]::StartNew()
$start = Start-Process -FilePath $pgCtl -ArgumentList @("-D", $pgData, "-l", $pgLog, "-w", "start") -Wait -PassThru -WindowStyle Hidden
$sw.Stop()
Write-Host "start exit=$($start.ExitCode) elapsed_ms=$($sw.ElapsedMilliseconds)"

Write-Host "=== pg_isready via direct Start-Process with redirect ==="
$outLog = Join-Path $root ".devlogs\ready.out.log"
$errLog = Join-Path $root ".devlogs\ready.err.log"
Remove-Item $outLog,$errLog -ErrorAction SilentlyContinue
$ready = Start-Process -FilePath $pgIsReady -ArgumentList @("-h","127.0.0.1","-p","5432","-U","postgres","-d","postgres") -Wait -PassThru -WindowStyle Hidden -RedirectStandardOutput $outLog -RedirectStandardError $errLog
Write-Host "ready exit=$($ready.ExitCode)"
Write-Host "OUT:"; Get-Content $outLog -ErrorAction SilentlyContinue
Write-Host "ERR:"; Get-Content $errLog -ErrorAction SilentlyContinue

```



```
Get-Process postgres,pg_ctl -ErrorAction SilentlyContinue | Format-Table Id, ProcessName, StartTime -AutoSize
Get-CimInstance Win32_Process | Where-Object { $_.Name -match 'postgres|pg_ctl|powershell' -and $_.CommandLine -match 'pg_ctl|pgsql' } | Select-Object ProcessId, ParentProcessId, Name, CommandLine | Format-List
Write-Host "--- logfile tail ---"
Get-Content "pgsql\logfile" -Tail 15
Write-Host "--- port ---"
$tcp = New-Object System.Net.Sockets.TcpClient
try { $task = $tcp.ConnectAsync("127.0.0.1", 5432); Write-Host ("connected=" + ($task.Wait(400) -and $tcp.Connected)) } catch { Write-Host $_ } finally { $tcp.Close() }

```

```
Get-CimInstance Win32_Process | Where-Object { $_.ProcessId -in 12516,21468,1916,30284,18700 } | Select-Object ProcessId, ParentProcessId, Name, CommandLine | Format-List
Write-Host "--- postgresql.conf logging ---"
Select-String -Path "pgsql\data\postgresql.conf" -Pattern "^(logging_collector|log_destination|log_directory|log_filename)" | ForEach-Object { $_.Line }

```

```
$root = (Get-Location).Path
$pgCtl = Join-Path $root "pgsql\bin\pg_ctl.exe"
$pgData = Join-Path $root "pgsql\data"
$postgres = Join-Path $root "pgsql\bin\postgres.exe"
$psql = Join-Path $root "pgsql\bin\psql.exe"
$logDir = Join-Path $root ".devlogs"

Write-Host "=== stop via pg_ctl ==="
$stop = Start-Process -FilePath $pgCtl -ArgumentList @("-D", $pgData, "stop") -WindowStyle Hidden -PassThru
# don't -Wait forever; poll until postgres is gone
for ($i = 0; $i -lt 15; $i++) {
  Start-Sleep -Seconds 1
  $alive = Get-Process postgres -ErrorAction SilentlyContinue
  if (-not $alive) { Write-Host "stopped after $($i+1)s pg_ctl_exit_check pid=$($stop.Id) hasexited=$($stop.HasExited)"; break }
}
Get-Process postgres -ErrorAction SilentlyContinue | Format-Table Id, ProcessName
if (Get-Process postgres -ErrorAction SilentlyContinue) { throw "postgres still running" }

Write-Host "=== start postgres.exe directly ==="
$outLog = Join-Path $logDir "postgres.out.log"
$errLog = Join-Path $logDir "postgres.err.log"
Remove-Item $outLog, $errLog -ErrorAction SilentlyContinue
$proc = Start-Process -FilePath $postgres -ArgumentList @("-D", $pgData) -WindowStyle Hidden -RedirectStandardOutput $outLog -RedirectStandardError $errLog -PassThru
Write-Host "started pid=$($proc.Id)"

$ok = $false
for ($i = 0; $i -lt 20; $i++) {
  $tcp = New-Object System.Net.Sockets.TcpClient
  try {
    $task = $tcp.ConnectAsync("127.0.0.1", 5432)
    if ($task.Wait(400) -and $tcp.Connected) { $ok = $true; break }
  } catch { } finally { $tcp.Close() }
  Start-Sleep -Seconds 1
}
Write-Host "port5432=$ok elapsed_loops=$i"
Write-Host "--- postgres.err.log ---"
Get-Content $errLog -ErrorAction SilentlyContinue
Write-Host "--- postgres.out.log ---"
Get-Content $outLog -ErrorAction SilentlyContinue

if (-not $ok) { throw "postgres did not listen" }

Write-Host "=== psql ==="
$psqlOut = Join-Path $logDir "psql.out.log"
$psqlErr = Join-Path $logDir "psql.err.log"
Remove-Item $psqlOut, $psqlErr -ErrorAction SilentlyContinue
$p = Start-Process -FilePath $psql -ArgumentList @("-h","127.0.0.1","-p","5432","-U","postgres","-d","postgres","-w","-tAc","SELECT 1") -Wait -PassThru -WindowStyle Hidden -RedirectStandardOutput $psqlOut -RedirectStandardError $psqlErr
Write-Host "psql exit=$($p.ExitCode)"
Write-Host "OUT:$(Get-Content $psqlOut -Raw -ErrorAction SilentlyContinue)"
Write-Host "ERR:$(Get-Content $psqlErr -Raw -ErrorAction SilentlyContinue)"

```

```
$psql = Join-Path (Get-Location) "pgsql\bin\psql.exe"
$psqlBase = @("-h", "127.0.0.1", "-p", "5432", "-U", "postgres", "-d", "postgres", "-w", "-v", "ON_ERROR_STOP=1")
$role = & $psql @($psqlBase + @("-tAc", "SELECT 1 FROM pg_roles WHERE rolname='oms'")) 2>&1
Write-Host "LASTEXITCODE=$LASTEXITCODE"
Write-Host "role=[$role]"
$db = & $psql @($psqlBase + @("-tAc", "SELECT 1 FROM pg_database WHERE datname='oms'")) 2>&1
Write-Host "LASTEXITCODE=$LASTEXITCODE"
Write-Host "db=[$db]"

```

```
$psql = Join-Path (Get-Location) "pgsql\bin\psql.exe"
$one = & $psql -h 127.0.0.1 -p 5432 -U postgres -d postgres -w -tAc "SELECT 1" 2>&1
Write-Host "code=$LASTEXITCODE one=[$one]"
$roles = & $psql -h 127.0.0.1 -p 5432 -U postgres -d postgres -w -tAc "SELECT rolname FROM pg_roles" 2>&1
Write-Host "roles:"
$roles | ForEach-Object { Write-Host "  [$_]" }

```

```
Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -and ($_.CommandLine -match 'dev\.ps1|make dev|scripts\\dev') } | Select-Object ProcessId, ParentProcessId, Name, CommandLine | Format-List
Get-Process redis-server, nginx, node, go -ErrorAction SilentlyContinue | Format-Table Id, ProcessName, StartTime -AutoSize
Test-Path frontend\node_modules

```

```
function Port($p) { $c = New-Object System.Net.Sockets.TcpClient; try { $t = $c.ConnectAsync("127.0.0.1", $p); Write-Host ("$p=" + ($t.Wait(300) -and $c.Connected)) } catch { Write-Host "$p=false" } finally { $c.Close() } }
Port 5432; Port 6379; Port 8080; Port 3000; Port 80

```

```
function Port($p) { $c = New-Object System.Net.Sockets.TcpClient; try { $t = $c.ConnectAsync("127.0.0.1", $p); Write-Host ("$p=" + ($t.Wait(300) -and $c.Connected)) } catch { Write-Host "$p=false" } finally { $c.Close() } }
Port 5432; Port 6379; Port 8080; Port 3000; Port 80

```

```
try { (Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8080/health).Content } catch { Write-Host "api: $($_.Exception.Message)" }
```

```
function Port($p) { $c = New-Object System.Net.Sockets.TcpClient; try { $t = $c.ConnectAsync("127.0.0.1", $p); Write-Host ("$p=" + ($t.Wait(300) -and $c.Connected)) } catch { Write-Host "$p=false" } finally { $c.Close() } }
Port 5432; Port 6379; Port 8080; Port 3000; Port 80
$psql = "D:\learning\languages\go\intermediate\order-management-system\pgsql\bin\psql.exe"
& $psql -h 127.0.0.1 -p 5432 -U oms -d oms -w -c "SELECT id, code, name, type, status FROM warehouses;"

```

```
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\stop.ps1
```

```
go test ./internal/reports/
```

```
go test ./internal/reports/; npx --yes tsc --noEmit
```

```
gofmt -w internal/reports/service.go internal/reports/http.go internal/reports/series.go
```

```
npx tsc --noEmit
```

```
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\stop.ps1
```

```
gofmt -w internal/platform/db/db.go internal/platform/db/number_test.go internal/cmd/seed/main.go 2>$null; gofmt -w internal/platform/db/db.go cmd/seed/main.go; go test ./internal/platform/db/ ./internal/customers/
```

```
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\stop.ps1; make dev
```

```
Write-Host "=== 8080 ==="
Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | Select-Object LocalAddress, LocalPort, State, OwningProcess | Format-Table -AutoSize
Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -and ($_.CommandLine -match 'cmd/api|cmd\\api|go-build|postgres|redis|next|8080') } | Select-Object ProcessId, ParentProcessId, Name, CommandLine | Format-List
Write-Host "=== listeners 8080/3000/6379/80 ==="
foreach ($p in 80,3000,6379,8080) {
  $c = Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue
  foreach ($x in $c) {
    $proc = Get-CimInstance Win32_Process -Filter "ProcessId=$($x.OwningProcess)" -ErrorAction SilentlyContinue
    Write-Host "port $p pid $($x.OwningProcess) $($proc.Name) $($proc.CommandLine)"
  }
}

```

```
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\stop.ps1
Start-Sleep -Seconds 1
Write-Host "=== remaining listeners ==="
foreach ($p in 80,3000,6379,8080) {
  $c = Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue
  if ($c) { $c | ForEach-Object { Write-Host "port $p still pid $($_.OwningProcess)" } } else { Write-Host "port $p free" }
}

```

```
foreach ($p in 80,3000,6379,8080,5432) {
  $c = Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue
  if ($c) {
    $c | ForEach-Object {
      $proc = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
      Write-Host "port $p pid $($_.OwningProcess) $($proc.ProcessName)"
    }
  } else { Write-Host "port $p free" }
}
Get-Process api,oms-api,worker,oms-worker,nginx,redis-server -ErrorAction SilentlyContinue | Format-Table Id, ProcessName -AutoSize

```



```
go test ./internal/users/ ./internal/app/; gofmt -l internal/users internal/app/api.go
```

```
curl.exe -sS -c .devlogs\oms-cookies.txt -b .devlogs\oms-cookies.txt -H "Content-Type: application/json" -H "Origin: http://127.0.0.1" -D .devlogs\oms-headers.txt -o .devlogs\oms-login.json -w "login_http=%{http_code}\n" http://127.0.0.1/api/v1/auth/login -d "{\"email\":\"admin@oms.local\",\"password\":\"DevAdmin123!\"}"
Write-Host "--- login body ---"
Get-Content .devlogs\oms-login.json
Write-Host "--- users ---"
curl.exe -sS -b .devlogs\oms-cookies.txt -H "Origin: http://127.0.0.1" -w "\nusers_http=%{http_code}\n" http://127.0.0.1/api/v1/users
Write-Host "--- roles ---"
curl.exe -sS -b .devlogs\oms-cookies.txt -H "Origin: http://127.0.0.1" -w "\nroles_http=%{http_code}\n" http://127.0.0.1/api/v1/users/roles
Write-Host "--- create ---"
curl.exe -sS -b .devlogs\oms-cookies.txt -H "Content-Type: application/json" -H "Origin: http://127.0.0.1" -w "\ncreate_http=%{http_code}\n" http://127.0.0.1/api/v1/users -d "{\"email\":\"pat.support@oms.local\",\"password\":\"TempPass123!\",\"first_name\":\"Pat\",\"last_name\":\"Support\",\"role\":\"CUSTOMER_SUPPORT\"}"
Write-Host "--- duplicate ---"
curl.exe -sS -b .devlogs\oms-cookies.txt -H "Content-Type: application/json" -H "Origin: http://127.0.0.1" -w "\ndup_http=%{http_code}\n" http://127.0.0.1/api/v1/users -d "{\"email\":\"admin@oms.local\",\"password\":\"TempPass123!\",\"first_name\":\"A\",\"last_name\":\"B\",\"role\":\"SALES_AGENT\"}"

```

```
$pat="01a0affe-0a60-7535-a1fa-45e0423ab878"
$admin="01900000-0000-7000-8000-000000000010"
Write-Host "==== SEARCH ===="
curl.exe -sS -b .devlogs/oms-cookies.txt -H "Origin: http://127.0.0.1" -w "`nsearch_http=%{http_code}`n" "http://127.0.0.1/api/v1/users?q=pat"
Write-Host "==== SUSPEND PAT ===="
curl.exe -sS -b .devlogs/oms-cookies.txt -H "Content-Type: application/json" -H "Origin: http://127.0.0.1" -w "`nsuspend_http=%{http_code}`n" --data-binary "@.devlogs/status-suspended.json" "http://127.0.0.1/api/v1/users/$pat/status"
Write-Host "==== FILTER SUSPENDED ===="
curl.exe -sS -b .devlogs/oms-cookies.txt -H "Origin: http://127.0.0.1" -w "`nfilter_http=%{http_code}`n" "http://127.0.0.1/api/v1/users?status=SUSPENDED"
Write-Host "==== ADD ROLE ===="
curl.exe -sS -b .devlogs/oms-cookies.txt -H "Content-Type: application/json" -H "Origin: http://127.0.0.1" -w "`nadd_http=%{http_code}`n" --data-binary "@.devlogs/role-sales.json" "http://127.0.0.1/api/v1/users/$pat/roles"
Write-Host "==== REMOVE ROLE ===="
curl.exe -sS -b .devlogs/oms-cookies.txt -H "Origin: http://127.0.0.1" -w "`ndel_http=%{http_code}`n" -X DELETE "http://127.0.0.1/api/v1/users/$pat/roles/SALES_AGENT"
Write-Host "==== SELF SUSPEND ===="
curl.exe -sS -b .devlogs/oms-cookies.txt -H "Content-Type: application/json" -H "Origin: http://127.0.0.1" -w "`nself_http=%{http_code}`n" --data-binary "@.devlogs/status-suspended.json" "http://127.0.0.1/api/v1/users/$admin/status"
Write-Host "==== LAST ADMIN ROLE ===="
curl.exe -sS -b .devlogs/oms-cookies.txt -H "Origin: http://127.0.0.1" -w "`nlast_http=%{http_code}`n" -X DELETE "http://127.0.0.1/api/v1/users/$admin/roles/ORGANIZATION_ADMIN"
Write-Host "==== ACTIVATE PAT ===="
Set-Content -Path .devlogs/status-active.json -Value '{"status":"ACTIVE"}' -NoNewline
curl.exe -sS -b .devlogs/oms-cookies.txt -H "Content-Type: application/json" -H "Origin: http://127.0.0.1" -w "`nact_http=%{http_code}`n" --data-binary "@.devlogs/status-active.json" "http://127.0.0.1/api/v1/users/$pat/status"
Write-Host "==== FORBIDDEN WRITE as manager ===="
Set-Content -Path .devlogs/login-mgr.json -Value '{"email":"manager@oms.local","password":"DevManager123!"}' -NoNewline
curl.exe -sS -c .devlogs/oms-mgr-cookies.txt -H "Content-Type: application/json" -H "Origin: http://127.0.0.1" --data-binary "@.devlogs/login-mgr.json" -o .devlogs/oms-mgr-login.json -w "mgr_login=%{http_code}`n" http://127.0.0.1/api/v1/auth/login
curl.exe -sS -b .devlogs/oms-mgr-cookies.txt -H "Origin: http://127.0.0.1" -w "`nmgr_list=%{http_code}`n" http://127.0.0.1/api/v1/users
curl.exe -sS -b .devlogs/oms-mgr-cookies.txt -H "Content-Type: application/json" -H "Origin: http://127.0.0.1" --data-binary "@.devlogs/create-user.json" -w "`nmgr_create=%{http_code}`n" http://127.0.0.1/api/v1/users

```

