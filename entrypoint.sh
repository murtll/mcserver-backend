#!/bin/bash

while test $# != 0
do
    case "$1" in
        --migrate) yarn migrate ;;
    esac
    shift
done

yarn start