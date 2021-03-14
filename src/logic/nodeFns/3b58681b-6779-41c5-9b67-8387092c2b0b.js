// imove-start: 入参：经纬度

export default async function(ctx) {
  const {
    location
  } = ctx.getPayload();
  return {
    location
  }
}