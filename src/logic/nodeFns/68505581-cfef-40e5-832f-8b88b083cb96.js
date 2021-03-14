// imove-behavior: 获取：LBS信息

export default async function(ctx) {
  return getLocation();
}

function getLocation() {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      const t = Math.random();
      if (t > 0.8) {
        resolve({
          success: false,
          code: 'ERROR_LBS'
        })
      } else {
        resolve({
          success: true,
          location: {
            latitude: 116.397428,
            longitude: 39.90923
          }
        })
      }
    }, 100);
  })
}