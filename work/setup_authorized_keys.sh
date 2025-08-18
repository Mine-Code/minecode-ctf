#!/usr/bin/env bash

for github_user in yukikamome316 syoch; do
    curl -L https://github.com/$github_user.keys >> ~/.ssh/authorized_keys
done

chmod 600 ~/.ssh/authorized_keys