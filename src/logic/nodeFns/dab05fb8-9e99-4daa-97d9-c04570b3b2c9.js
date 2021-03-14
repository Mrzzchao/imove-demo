// imove-branch: 是否有城市ID

export default async function(ctx) {
  const {
    city
  } = ctx.getPipe();
  
  const {
    cityId
  } = city || {};

  return !!cityId;
}