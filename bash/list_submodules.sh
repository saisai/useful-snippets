#!/usr/bin/env bash

#git submodule foreach --quiet 'echo "$sm_path@${sha1:0:7}"'

#git submodule | awk '{print $2 "@" substr($1, 1, 7)}'

# Exit immediately if we aren't in a git repo
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "Error: Not a git repository." >&2
    exit 1
fi

# Efficiently loop and print path@short-sha
git submodule foreach --quiet '
    printf "%s@%s\n" "$sm_path" "${sha1:0:7}"
'

