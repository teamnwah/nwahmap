#!/usr/bin/env bash
set -e

cd "$(dirname "$(realpath "$0")")/..";
mkdir -p public/tileset/mwmap;
cd $_;
tar -xvf ../../../storage/mwmap-tiles.txz;
