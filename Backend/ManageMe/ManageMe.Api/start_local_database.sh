#!/bin/bash

force_flag=0
migration_flag=0

while getopts "fm" opt; do
  case $opt in
  f) force_flag=1 ;;
  m) migration_flag=1 ;;
  \?)
    echo "Invalid option -$OPTARG" >&2
    exit 1
    ;;
  esac
done

export DATABASE_PASSWORD=Password123!
export CONTAINER_NAME=sql_server

if [ $force_flag -eq 1 ]; then
  echo "Stopping and removing existing container..."
  docker container stop ${CONTAINER_NAME}
  docker rm sql_server
  docker run --name ${CONTAINER_NAME} -e 'ACCEPT_EULA=Y' -e "SA_PASSWORD=${DATABASE_PASSWORD}" -e 'MSSQL_ENCRYPT=0' -p 1433:1433 -d mcr.microsoft.com/mssql/server:latest

else
  docker run --name ${CONTAINER_NAME} -e 'ACCEPT_EULA=Y' -e "SA_PASSWORD=${DATABASE_PASSWORD}" -e 'MSSQL_ENCRYPT=0' -p 1433:1433 -d mcr.microsoft.com/mssql/server:latest
  \  || {
    echo "[TIP] Container could be already running. Use -f flag to force stop and restart."
    exit 1
  }
fi

if [ $migration_flag -eq 1 ]; then
  dotnet ef database update
fi
