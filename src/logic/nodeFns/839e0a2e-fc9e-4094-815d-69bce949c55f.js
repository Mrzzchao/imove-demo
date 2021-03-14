// imove-branch: LBS 成功

export default async function(ctx) {
  const {
    success
  } = ctx.getPipe();
  console.log(ctx.getPipe());
  return success;
}