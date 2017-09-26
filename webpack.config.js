module.exports = {
  entry: [ // client app bundle here
    './public/src/index.jsx'
  ],
  output: {
    filename: 'bundle.js',
    path: __dirname + '/public/dist'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        // include: [__dirname + '/src'],
        // exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-2']
        }
      }
    ]
  }
}
