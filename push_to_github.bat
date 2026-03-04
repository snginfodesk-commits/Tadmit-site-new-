@echo off
set "GIT_SSH_COMMAND=ssh -i C:/Users/User/.ssh/id_ed25519_antigravity -o StrictHostKeyChecking=no"
"C:/Program Files/Git/bin/git.exe" push -u origin master
