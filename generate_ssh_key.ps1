$sshDir = "$env:USERPROFILE\.ssh"
if (-not (Test-Path $sshDir)) { New-Item -ItemType Directory -Path $sshDir | Out-Null }
ssh-keygen -t ed25519 -C "antigravity@example.com" -f "$sshDir\id_ed25519" -N ""
