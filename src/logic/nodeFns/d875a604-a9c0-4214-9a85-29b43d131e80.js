// imove-behavior: 获取：LBS 转 城市

export default async function(ctx) {
  const {
    location
  } = ctx.getPipe();
  return getCity();
}

function getCity(location) {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      const t = Math.random();
      if (t > 0.8) {
        resolve({
          success: false,
          code: 'ERROR_CITY_API'
        })
      } else {
        resolve({
          success: true,
          city: {
            "cityno": "beijing",
            "citynm": "北京",
            "cityid": "101010100",
          }
        })
      }
    }, 100);
  })
}