# cx-inferno

Experimental [CxJS](https://cxjs.io) rendering based on [Inferno](https://infernojs.org/).
Please note that it's very likely that you'll encounter problems.

### Installation

```
npm install cx-inferno inferno-compat --save
```

### Usage

In your webpack config add the following alias:

```
resolve: {
      alias: {
         'cx-react': 'cx-inferno'
      }
   },
```

