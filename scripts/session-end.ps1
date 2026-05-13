# session-end.ps1
# Run this at the end of each OpenCode session

param(
    [string]$Message = ""
)

$PROJECT_ROOT = "C:\Tushar\tussxar-projects\sh-web"
$SESSION_DATE = Get-Date -Format "yyyy-MM-dd"
$SESSION_FILE = "$PROJECT_ROOT\.opencode\sessions\$SESSION_DATE-session.md"
$TODO_FILE = "$PROJECT_ROOT\.opencode\TODO.md"

# Ensure sessions directory exists
$SessionsDir = "$PROJECT_ROOT\.opencode\sessions"
if (!(Test-Path $SessionsDir)) {
    New-Item -ItemType Directory -Path $SessionsDir -Force | Out-Null
    Write-Output "Created sessions directory"
}

# Get git info
Set-Location $PROJECT_ROOT
$LAST_COMMIT = git log -1 --oneline
$BRANCH = git branch --show-current
$CHANGES = git status --short
$FILES_CHANGED = git diff --stat HEAD~1 2>$null

# Create session file
$Content = @"
# Session: $SESSION_DATE

### Last Commit
- ``$LAST_COMMIT``
- Branch: ``$BRANCH``

### Files Changed This Session
``````
$FILES_CHANGED
``````

### Uncommitted Changes
``````
$CHANGES
``````

### Key Accomplishments
- Update this section with what was done

### Pending Work
- See .opencode/TODO.md

---
*Session saved at $(Get-Date -Format "HH:mm:ss")*
"@

$Content | Out-File -FilePath $SESSION_FILE -Encoding utf8
Write-Output "Session saved to $SESSION_FILE"

# Update TODO last updated
if (Test-Path $TODO_FILE) {
    $TodoContent = Get-Content $TODO_FILE -Raw
    $TodoContent = $TodoContent -replace '\*\*Last Updated:\*\*.*', "**Last Updated:** $SESSION_DATE"
    $TodoContent | Out-File -FilePath $TODO_FILE -Encoding utf8
    Write-Output "TODO.md updated"
}

Write-Output "`n=== Session Summary ==="
Write-Output "Last Commit: $LAST_COMMIT"
Write-Output "Branch: $BRANCH"
Write-Output "Uncommitted Changes: $($CHANGES.Count)"
Write-Output "`nRun 'git status' for details"
Write-Output "Run '.\.opencode\commands.md' for next steps"
