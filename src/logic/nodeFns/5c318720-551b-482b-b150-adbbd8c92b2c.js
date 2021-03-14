// imove-branch: 获取成功

export default async function(ctx) {
  const {
    success
  } = ctx.getPipe();
  return success;
}