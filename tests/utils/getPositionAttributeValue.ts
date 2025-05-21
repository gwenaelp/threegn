
export default (geometry) => {
  let vectors:number[][] = [];
  for (let i = 0; i < geometry.attributes.position.count; i++) {
    vectors.push([
      geometry.attributes.position.getX(i),
      geometry.attributes.position.getY(i),
      geometry.attributes.position.getZ(i),
      geometry.attributes.position.getW(i),
    ]);
  }
  return vectors;
}