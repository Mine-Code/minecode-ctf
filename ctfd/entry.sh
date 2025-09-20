#!/bin/bash -ex

touch /opt/storage/ctfd.db
mkdir -p /opt/storage/uploads
chown -R ctfd:ctfd /opt/storage

[ -f /opt/CTFd/CTFd/ctfd.db ] && rm /opt/CTFd/CTFd/ctfd.db
ln -sr /opt/storage/ctfd.db /opt/CTFd/CTFd/ctfd.db

[ -d /opt/CTFd/CTFd/uploads ] && rm -rf /opt/CTFd/CTFd/uploads
ln -sr /opt/storage/uploads /opt/CTFd/CTFd/uploads

# install plugin dependencies
req=/opt/CTFd/CTFd/plugins/ctfd-discord-webhook-plugin/requirements.txt
if [ -f "$req" ]; then
  pip install --no-cache-dir -r "$req" \
  || echo "[WARN] Failed to install discord webhook plugin requirements"
fi

bash /opt/CTFd/docker-entrypoint.sh
