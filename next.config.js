const path = require('path');

module.exports = {
  reactStrictMode: true,
  webpack: config => {
    // Important: return the modified config
    config.module.rules.push({
        test: /\.txt/,
        use: [{
            loader: path.resolve('./text_loader.js')
        }],
    });

    return config;
  }  
}
