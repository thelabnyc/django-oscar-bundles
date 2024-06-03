#!/usr/bin/env bash

echo "Updating packages with npm..."
NODE_ENV="dev" npm i
echo "Done!"

exec $@
