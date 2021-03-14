// imove-branch: 是否有LBS数据

export default async function(ctx) {
  const {
    location
  } = ctx.getPipe();
  return !!location;
}