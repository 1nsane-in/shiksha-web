#!/bin/bash
# OpenCode Session End Script
# Run this at the end of each session to document progress

SESSION_DATE=$(date +%Y-%m-%d)
SESSION_FILE=".opencode/sessions/${SESSION_DATE}-session.md"
TODO_FILE=".opencode/TODO.md"

# Get last commit info
LAST_COMMIT=$(git log -1 --oneline)
LAST_COMMIT_MSG=$(git log -1 --format="%s")
BRANCH=$(git branch --show-current)

echo "# Session: $SESSION_DATE" > "$SESSION_FILE"
echo "" >> "$SESSION_FILE"
echo "### Last Commit" >> "$SESSION_FILE"
echo "- \`$LAST_COMMIT\`" >> "$SESSION_FILE"
echo "- Branch: \`$BRANCH\`" >> "$SESSION_FILE"
echo "" >> "$SESSION_FILE"
echo "### Files Changed" >> "$SESSION_FILE"
git diff --stat HEAD~1 >> "$SESSION_FILE" 2>/dev/null || echo "- No changes" >> "$SESSION_FILE"
echo "" >> "$SESSION_FILE"
echo "### Next Steps" >> "$SESSION_FILE"
echo "- See .opencode/TODO.md" >> "$SESSION_FILE"

echo "Session saved to $SESSION_FILE"

# Update TODO.md last updated date
if [[ -f "$TODO_FILE" ]]; then
    sed -i "s/\*\*Last Updated:\*\*.*/\*\*Last Updated:\*\* $SESSION_DATE/" "$TODO_FILE"
    echo "TODO.md updated"
fi

echo "Session tracking complete!"
