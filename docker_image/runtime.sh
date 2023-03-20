#!/bin/bash
set -e

if [ "$METADATA_JSON" = "" ]; then
    export METADATA_JSON=/mnt/metadata.json
fi

if [ "$CHALLENGE" = "yes" ]; then
    chmod 700 $METADATA_JSON
    chown root:root $METADATA_JSON

    function execute() {
        su -c "sh -ic \"$1\"" ctf
    }
else
    function execute() {
        sh -ic "$1"
    }
fi

function extract_field() {
    cat $METADATA_JSON | jq "$1" -r
}

case $1 in
    init)
        execute "$(extract_field .tasks.init)"
        ;;
    runtime)
        execute "$(extract_field .tasks.runtime)"
        ;;
    daemon)
        execute "$(extract_field .tasks.daemon)"
        ;;
    debug)
        execute "exec $SHELL"
        ;;
    *)
        echo "Unknown command: $1"
        exit 1
        ;;
esac