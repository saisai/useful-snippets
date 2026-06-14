IGNORE_DIR="folder-name"

# for d in $(find . -type d -name "dist"); do
#     if [[ ! "$d" == "*${IGNORE_DIR}*" && ! "$d" == *"tmp"* ]]; then
#         echo "$d"
#       rm -rfv "$d"
#     fi
# done


cleanup_dist() {
    find "${1:-.}" -type d -name "dist" \
        ! -path "*${IGNORE_DIR}*" \
        ! -path "*tmp*" \
        -prune \
        -exec rm -rfv {} +
}

cleanup_build() {
    find "${1:-.}" -type d -name "build" \
        ! -path "*${IGNORE_DIR}*" \
        ! -path "*tmp*" \
        -prune \
        -exec ls -al {} +
}


clean_builds() {
    # -prune is used here to stop find from looking inside
    # directories we are about to delete or ignore.
    find . -type d -name "build" \
        ! -path "./${IGNORE_DIR}/build" \
        ! -path "*venv*" \
        ! -path "*tmp*" \
        -prune \
        -exec rm -rfv {} +
}

check_builds() {
    find . -type d -name "build" ! -path "./${IGNORE_DIR}/build"  ! -path "*venv*"
}

cleanup_dist
# check_builds
clean_builds
# cleanup_build
