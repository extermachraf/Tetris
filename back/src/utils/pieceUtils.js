function getRandomPieceShape() {
  //   return Array.from({ length: rows }, () => {
  //     Array.from({ length: cols }, () => Math.round(0));
  //   });
}

function testHelper(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.round(Math.random()))
  );
}
module.exports = { getRandomPieceShape, testHelper };
