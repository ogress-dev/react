const crypto = require('crypto');

function generateSignature(consumerSecret, method, url, params) {
  const signatureBase = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(params)}`;
  return crypto.createHmac('sha1', consumerSecret).update(signatureBase).digest('base64');
}

module.exports = generateSignature;
