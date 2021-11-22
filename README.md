# thisisnumberone

## References

Stacks Network - Clarity Development
https://explorer.stacks.co/?chain=testnet
https://docs.blockstack.org/write-smart-contracts/overview
https://docs.blockstack.org/references/language-overview

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
# testnet


see https://github.com/blockstack/stacks-blockchain/blob/63d24b1185bca6a35988aa90667bc5f0a226acb9/testnet/stacks-node/conf/testnet-follower-conf.toml

see https://github.com/blockstack/stacks-blockchain/issues/2943

docker run -d --rm \
  --name stacks-blockchain \
  -v $(pwd)/persistent-data/stacks-blockchain/testnet:/root/stacks-node/data \
  -v $(pwd)/config/testnet:/src/stacks-node \
  -p 20443:20443 \
  -p 20444:20444 \
  blockstack/stacks-blockchain \
/bin/stacks-node start --config /src/stacks-node/Config.toml