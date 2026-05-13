# OpenCode Quick Commands

Add these aliases/functions to your shell profile for quick access:

## PowerShell (profile.ps1 or Microsoft.PowerShell_profile.ps1)

```powershell
# Project status
function map-status {
    Set-Location "C:\Tushar\tussxar-projects\sh-web"
    Write-Output "=== Medical Admission Platform Status ===`n"
    Write-Output "Last Commit:"
    git log -1 --oneline
    Write-Output "`nBranch: $(git branch --show-current)"
    Write-Output "`nPending TODO:"
    Select-String -Path ".opencode\TODO.md" -Pattern "^\- \[ \]" | Select-Object -First 5
    Write-Output "`nRun 'code .opencode\TODO.md' for full list"
}

# Start development
function map-dev {
    Set-Location "C:\Tushar\tussxar-projects\sh-web"
    pnpm dev
}

# API only
function map-api {
    Set-Location "C:\Tushar\tussxar-projects\sh-web"
    pnpm --filter @repo/api dev
}

# Web only
function map-web {
    Set-Location "C:\Tushar\tussxar-projects\sh-web"
    pnpm --filter @repo/web dev
}

# End session (save progress)
function map-end {
    Set-Location "C:\Tushar\tussxar-projects\sh-web"
    powershell -File ".\scripts\session-end.ps1"
    git add .
    Write-Output "Session saved. Remember to commit if needed."
}

# View TODO
function map-todo {
    Set-Location "C:\Tushar\tussxar-projects\sh-web"
    code .opencode/TODO.md
}

# View sessions
function map-sessions {
    Set-Location "C:\Tushar\tussxar-projects\sh-web"
    Get-ChildItem .opencode\sessions | Sort-Object LastWriteTime -Descending
}

# Prisma quick commands
function map-prisma-migrate {
    Set-Location "C:\Tushar\tussxar-projects\sh-web\apps\api"
    npx prisma migrate dev
}

function map-prisma-studio {
    Set-Location "C:\Tushar\tussxar-projects\sh-web\apps\api"
    npx prisma studio
}

function map-prisma-generate {
    Set-Location "C:\Tushar\tussxar-projects\sh-web\apps\api"
    npx prisma generate
}

function map-prisma-seed {
    Set-Location "C:\Tushar\tussxar-projects\sh-web\apps\api"
    npx prisma db seed
}
```

## Bash (add to ~/.bashrc or ~/.zshrc)

```bash
# Project status
function map-status {
    cd "/c/Tushar/tussxar-projects/sh-web"
    echo "=== Medical Admission Platform Status ==="
    echo ""
    echo "Last Commit:"
    git log -1 --oneline
    echo ""
    echo "Branch: $(git branch --show-current)"
    echo ""
    echo "Pending TODO:"
    grep "^- \[ \]" .opencode/TODO.md | head -5
    echo ""
    echo "Run 'code .opencode/TODO.md' for full list"
}

# Start development
function map-dev {
    cd "/c/Tushar/tussxar-projects/sh-web"
    pnpm dev
}

# End session
function map-end {
    cd "/c/Tushar/tussxar-projects/sh-web"
    bash ./scripts/session-end.sh
    git add .
    echo "Session saved. Remember to commit if needed."
}

# View TODO
function map-todo {
    cd "/c/Tushar/tussxar-projects/sh-web"
    code .opencode/TODO.md
}

# View sessions
function map-sessions {
    cd "/c/Tushar/tussxar-projects/sh-web"
    ls -lt .opencode/sessions/
}
```

---

## Quick Reference

| Command | Action |
|---------|--------|
| `map-status` | Show project status + pending TODO |
| `map-dev` | Start full development (web + api) |
| `map-api` | Start API only |
| `map-web` | Start Web only |
| `map-end` | Save session progress |
| `map-todo` | Open TODO.md |
| `map-sessions` | List all session files |
| `map-prisma-migrate` | Run Prisma migrations |
| `map-prisma-studio` | Open Prisma Studio |
| `map-prisma-generate` | Generate Prisma client |
| `map-prisma-seed` | Run database seed |

---

## OpenCode Prompts for Next Session

Copy-paste these to resume work:

### General Status
```
Read .opencode/TODO.md and continue from where we left off
```

### Specific Tasks

**Setup Supabase:**
```
Read.TODO.md and help me setup Supabase project
```

**Create Payments Module:**
```
Read .opencode/TODO.md and create the Payments module with Razorpay integration
```

**Create Letters Module:**
```
Read .opencode/TODO.md and create the Letters module for admission/invitation letters
```

**Build Frontend:**
```
Read .opencode/TODO.md and start building the Next.js frontend with auth pages
```

**Fix Issues:**
```
Run pnpm dev and fix any issues that come up
```

---

## Files Structure

```
.opencode/
├── TODO.md              # Master TODO list
├── sessions/            # Session history
│   └── YYYY-MM-DD-session.md
└── commands.md          # This file
```
