#!/bin/bash

# Enable for debugging
# set -e
# set -x


# Kills process tree
killtree() {
  local _pid=$1
  kill -stop ${_pid} # needed to stop quickly forking parent from producing children between child killing and parent killing
  for _child in $(pgrep -P ${_pid}); do
    killtree ${_child}
  done
  kill -TERM ${_pid}
}


clear
echo "Running ui-tests"
echo "***************************"

NIGHTWATCH_BINARY="./node_modules/nightwatch/bin/nightwatch"

#echo "Starting local server."
#START_SERVER=1
#CONFIG=hsl PORT=8080 npm run dev-nowatch &
echo "Building app"
npm run build; CONFIG=hsl PORT=8080 npm run start &
NODE_PID=$!
sleep 15

echo "Starting chromedriver"
DBUS_SESSION_BUS_ADDRESS=/dev/null CHROMEDRIVER_VERSION=2.24 chromedriver --verbose --log-path=chromedriver.log &
DRIVER_PID=$!
sleep 2

#while true; do ps aux;sleep 10;done &
#WATCHER_PID=$!

echo "Running tests"
$NIGHTWATCH_BINARY -c ./test/flow/nightwatch-snap.json --retries 3
TESTSTATUS=$?
echo "Done"


#killtree $WATCHER_PID
killtree $NODE_PID
killtree $DRIVER_PID

echo "Exiting with status $TESTSTATUS"

exit $TESTSTATUS
