$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath($PSScriptRoot).TrimEnd('\')
$url = 'http://127.0.0.1:47833/'

function Read-Health {
    try { Invoke-RestMethod -Uri ($url + 'health') -TimeoutSec 1 -UseBasicParsing }
    catch { $null }
}

function Test-OurServer($health) {
    return $null -ne $health -and $health.app -ceq 'romana-local' -and $health.root -ceq $root
}

$mutex = [Threading.Mutex]::new($false, 'Local\RomanaLocalLauncher47833')
$locked = $false
try {
    try { $locked = $mutex.WaitOne(15000) }
    catch [Threading.AbandonedMutexException] { $locked = $true }
    if (-not $locked) { throw 'Запуск уже выполняется. Подождите несколько секунд и попробуйте снова.' }

    $health = Read-Health
    if (-not (Test-OurServer $health)) {
        $client = [Net.Sockets.TcpClient]::new()
        $busy = $false
        try { $client.Connect('127.0.0.1', 47833); $busy = $true }
        catch {}
        finally { $client.Dispose() }
        if ($busy) { throw 'Адрес приложения занят другой программой или другой копией Romana. Закройте её и попробуйте снова.' }

        $node = Join-Path $root 'runtime\node.exe'
        if (-not (Test-Path -LiteralPath $node -PathType Leaf)) {
            $installedNode = Get-Command -Name node.exe -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
            if (-not $installedNode) { throw 'Установите Node.js 22.13.0 или новее, затем выполните npm run setup и npm run build в папке RomLang.' }
            $node = $installedNode.Path
        }
        $server = Join-Path $root 'server.mjs'
        if (-not (Test-Path -LiteralPath $server -PathType Leaf)) {
            throw 'В папке приложения отсутствует server.mjs. Загрузите исходники RomLang целиком.'
        }
        if (-not (Test-Path -LiteralPath (Join-Path $root 'www\index.html') -PathType Leaf)) {
            throw 'Курс ещё не собран. Откройте терминал в папке RomLang и выполните npm run setup, затем npm run build. После этого откройте Start.cmd.'
        }
        [IO.Directory]::CreateDirectory((Join-Path $root 'runtime')) | Out-Null
        $process = Start-Process -FilePath $node -ArgumentList '--experimental-strip-types server.mjs' -WorkingDirectory $root -WindowStyle Hidden -RedirectStandardError (Join-Path $root 'runtime\server-error.log') -PassThru
        $deadline = [DateTime]::UtcNow.AddSeconds(12)
        do {
            Start-Sleep -Milliseconds 100
            $health = Read-Health
            if (Test-OurServer $health) { break }
            $process.Refresh()
            if ($process.HasExited) { break }
        } while ([DateTime]::UtcNow -lt $deadline)
        if (-not (Test-OurServer $health)) {
            throw 'Не удалось запустить Romana. Сведения об ошибке: runtime\server-error.log. Попробуйте снова после перезагрузки компьютера.'
        }
    }
}
catch {
    Add-Type -AssemblyName System.Windows.Forms
    [void][Windows.Forms.MessageBox]::Show($_.Exception.Message, 'Romana', 'OK', 'Error')
    exit 1
}
finally {
    if ($locked) { $mutex.ReleaseMutex() }
    $mutex.Dispose()
}

$browsers = @(
    (Join-Path $env:ProgramFiles 'Google\Chrome\Application\chrome.exe'),
    (Join-Path $env:LOCALAPPDATA 'Google\Chrome\Application\chrome.exe'),
    (Join-Path ${env:ProgramFiles(x86)} 'Microsoft\Edge\Application\msedge.exe'),
    (Join-Path $env:ProgramFiles 'Microsoft\Edge\Application\msedge.exe')
)
$browser = $browsers | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if ($browser) { Start-Process -FilePath $browser -ArgumentList "--app=$url" }
else { Start-Process $url }
