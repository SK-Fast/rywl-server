#!/bin/bash
echo "Starting Service..."
nohup node index.js 1>/dev/null 2>/dev/null &
