# cx-preact

Experimental [CxJS](https://cxjs.io) rendering based on [Preact](https://preactjs.com/).
Please note that it's very likely that you'll encounter problems.

### Installation

```
npm install cx-preact preact-compat preact --save
```

### Usage

In your webpack config add the following alias:

```
resolve: {
      alias: {
         'cx-react': 'cx-preact'
      }
   },
```

