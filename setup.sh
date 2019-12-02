#!/bin/bash

table=$1

aws --profile vibrant dynamodb describe-table --table-name "${table}"

if [[ $? -ne 0 ]]; then
    aws --profile vibrant dynamodb create-table --table-name "${table}" --attribute-definitions AttributeName=CallerKey,AttributeType=S --key-schema AttributeName=CallerKey,KeyType=HASH --billing-mode PAY_PER_REQUEST
fi
