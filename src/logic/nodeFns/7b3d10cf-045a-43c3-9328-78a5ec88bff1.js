// imove-start: 入参：城市

export default async function(ctx) {
  const {
    city
  } = ctx.getPayload();
  return {
    city
  }
}