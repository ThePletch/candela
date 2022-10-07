#!/usr/bin/env bash
###
# Wait for a canary file to contain the current MD5 checksum of the target file.
# Useful for waiting for an external operation to complete (in our case, waiting
# for dependency reinstalls)
###

set -e
set -o pipefail

TARGET=$1
CANARYFILE=$2
CMD=${@:3}

touch $CANARYFILE

TARGET_MD5=$(./md5 $TARGET)

echo "Waiting for canary file $CANARYFILE to contain md5sum $TARGET_MD5..." 1>&2
( tail -f $CANARYFILE & echo $! >&3 ) 3>tailpid | grep -q $TARGET_MD5 &
greppid=$!
tailpid=$(<tailpid)
function kill_tail () {
    if [ ! -z "$tailpid" ]; then
        kill $tailpid || true
    else
        echo "No tail process running. Nothing to kill."
    fi
}
trap kill_tail EXIT
wait $greppid
echo "Canary string detected. Continuing." 1>&2
trap - EXIT
kill_tail
bash -c "$CMD"
