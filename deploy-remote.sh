#!/bin/bash -e
set -e;

export DEPLOYMENT=$1
PATH_DEPLOY=../radsoc/volumes/www/production/thisisnumberone
mkdir -p $PATH_DEPLOY
export SERVER=locke.brightblock.org
export BUILDER=build-stag
if [ "$DEPLOYMENT" == "prod" ]; then
  SERVER=hume.brightblock.org;
  #SERVER=russell.risidio.com;
  BUILDER=build-prod
fi

printf "\n-----------------------------------------------------------------------------------------------------\n";
printf "Running script: $0 \n";
printf "Deploying to: $SERVER \n";
printf "\n-----------------------------------------------------------------------------------------------------\n";

function __build() {
  pushd $BUILD_PATH
  npm run $BUILDER
  popd;
  echo "Initialisation of $BUILD_PATH complete";
}

function __pushcode() {
  printf "\n- deploying from pipeline build \n";
  rsync -aP -e "ssh  -p 7019" $PATH_DEPLOY/* bob@$SERVER:/var/www/thisisnumberone
}

# BUILD_PATH=../fe-lsat
# __build
# cp $BUILD_PATH/dist/lsat-entry*.js $PATH_DEPLOY/.

BUILD_PATH=./
__build
cp -r ./dist/* $PATH_DEPLOY/.

#SERVER=hume.brightblock.org
#__pushcode
#SERVER=locke.brightblock.org
__pushcode

exit 0;
