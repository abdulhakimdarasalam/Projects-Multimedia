#!/bin/sh
set -e

host="$1"
shift
cmd="$@"

echo "⏳ Waiting for MySQL ($host:3306) to be ready..."
until nc -z "$host" 3306; do
  sleep 2
done

echo "✅ MySQL is ready! Starting app..."
exec $cmd
